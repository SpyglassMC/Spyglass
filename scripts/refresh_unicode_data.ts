// Usage: node scripts/refresh_unicode_data.ts [--force] [--write-lookup]
//
// Fetches `UnicodeData.txt` and `Blocks.txt` from
// https://www.unicode.org/Public/UNIDATA/, caches them in `scripts/unicode/`
// (gitignored), and writes `scripts/unicode/data.json` in the shape the
// production endpoint serves at `api.spyglassmc.com/unicode/data.json`.
//
// Re-runs are cheap: cached files are reused unless upstream returns a 304
// with a different ETag. Pass `--force` to re-fetch unconditionally.
//
// Pass `--write-lookup` to also copy the generated `data.json` into
// `packages/core/src/dependency/unicode-lookup-table.json` for use by
// callers that prefer a vendored copy over the network endpoint.

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const UNICODE_DATA_URL = 'https://www.unicode.org/Public/UNIDATA/UnicodeData.txt'
const BLOCKS_URL = 'https://www.unicode.org/Public/UNIDATA/Blocks.txt'
const FETCH_TIMEOUT_MS = 30_000
const USER_AGENT = 'SpyglassMC (+https://spyglassmc.com)'

// Mirror packages/web-api-server/src/unicode.ts -> MaxUnicodeCodepoint.
const MaxUnicodeCodepoint = 101759

interface UnicodeDataJson {
	version: string
	names: { [name: string]: number }
	namesInverse: { [hex: string]: [string, string] }
	ranges: { [name: string]: [number, number] }
	blocks: { [name: string]: [number, number] }
}

interface ParsedEntry {
	codepoint: number
	primary: string
	secondary: string
}

function parseUnicodeDataEntries(text: string): ParsedEntry[] {
	const out: ParsedEntry[] = []
	for (const line of text.split('\n')) {
		if (!line) {
			continue
		}
		const fields = line.split(';')
		out.push({
			codepoint: parseInt(fields[0]!, 16),
			primary: fields[1]!,
			secondary: fields[10]!,
		})
	}
	return out
}

function parseBlocks(text: string): { [name: string]: [number, number] } {
	const out: { [name: string]: [number, number] } = {}
	for (const line of text.split('\n')) {
		if (!line || line.startsWith('#')) {
			continue
		}
		const m = line.match(/^([0-9A-F]+)\.\.([0-9A-F]+);\s*(.+)$/)
		if (m) {
			out[m[3]!.trim().toLowerCase()] = [parseInt(m[1]!, 16), parseInt(m[2]!, 16)]
		}
	}
	return out
}

function parseUnicodeVersion(blocksText: string): string {
	const m = blocksText.match(/^# Blocks-(\d+\.\d+\.\d+)\.txt/m)
	return m?.[1] ?? 'unknown'
}

function buildUnicodeDataJson(
	unicodeDataText: string,
	blocksText: string,
): UnicodeDataJson {
	const entries = parseUnicodeDataEntries(unicodeDataText)
	const blocks = parseBlocks(blocksText)

	const names: { [name: string]: number } = {}
	const namesInverse: { [hex: string]: [string, string] } = {}
	const rangeStarts = new Map<string, number>()
	const ranges: { [name: string]: [number, number] } = {}

	for (const e of entries) {
		namesInverse[e.codepoint.toString(16)] = [e.primary, e.secondary]
		if (e.primary && !e.primary.startsWith('<')) {
			const key = e.primary.toLowerCase()
			if (!(key in names)) {
				names[key] = e.codepoint
			}
		}
		if (e.secondary) {
			const key = e.secondary.toLowerCase()
			if (!(key in names)) {
				names[key] = e.codepoint
			}
		}
		const firstMatch = e.primary.match(/^<(.+), First>$/)
		if (firstMatch) {
			rangeStarts.set(firstMatch[1]!, e.codepoint)
			continue
		}
		const lastMatch = e.primary.match(/^<(.+), Last>$/)
		if (lastMatch) {
			const start = rangeStarts.get(lastMatch[1]!)
			if (start !== undefined) {
				ranges[lastMatch[1]!.toLowerCase()] = [start, e.codepoint]
				rangeStarts.delete(lastMatch[1]!)
			}
		}
	}

	return {
		version: parseUnicodeVersion(blocksText),
		names,
		namesInverse,
		ranges,
		blocks,
	}
}

function applyMaxCodepointCutoff(data: UnicodeDataJson): UnicodeDataJson {
	const cutoff = MaxUnicodeCodepoint
	const names: { [name: string]: number } = {}
	const namesInverse: { [hex: string]: [string, string] } = {}
	const ranges: { [name: string]: [number, number] } = {}
	const blocks: { [name: string]: [number, number] } = {}

	for (const [name, codepoint] of Object.entries(data.names)) {
		if (codepoint <= cutoff) {
			names[name] = codepoint
		}
	}
	for (const [hex, entry] of Object.entries(data.namesInverse)) {
		if (parseInt(hex, 16) <= cutoff) {
			namesInverse[hex] = entry
		}
	}
	for (const [name, [start, end]] of Object.entries(data.ranges)) {
		if (start <= cutoff) {
			ranges[name] = [start, Math.min(end, cutoff)]
		}
	}
	for (const [name, [start, end]] of Object.entries(data.blocks)) {
		if (start > cutoff) {
			continue
		}
		blocks[name] = [start, Math.min(end, cutoff)]
	}

	return { version: data.version, names, namesInverse, ranges, blocks }
}

function sha256(text: string): string {
	return createHash('sha256').update(text).digest('hex')
}

/**
 * Fetches `url` and writes the body to `dest`. If `dest` already exists and
 * the server returns a 304 (matching the cached file's stored
 * `Last-Modified` timestamp), the cached file is kept and `cached: true` is
 * returned.
 *
 * We use `If-Modified-Since` rather than `If-None-Match` because
 * `unicode.org`'s CDN does not honour weak ETags consistently across
 * requests (gzip representation differences cause mismatches). The
 * `Last-Modified` header is the more reliable validator for these files.
 */
async function fetchToCache(
	url: string,
	dest: string,
	metaFile: string,
	force: boolean,
): Promise<{ text: string; cached: boolean }> {
	let cachedLastModified: string | undefined
	if (!force) {
		try {
			const line = (await readFile(metaFile, 'utf-8')).trim()
			cachedLastModified = line || undefined
		} catch {
			// No cached metadata -> treat as a cold fetch.
		}
	}

	const headers: Record<string, string> = { 'User-Agent': USER_AGENT }
	if (cachedLastModified) {
		headers['If-Modified-Since'] = cachedLastModified
	}

	const response = await fetch(url, {
		headers,
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	})

	if (response.status === 304) {
		const text = await readFile(dest, 'utf-8')
		return { text, cached: true }
	}
	if (!response.ok) {
		throw new Error(`Failed fetching ${url}: ${response.status} ${response.statusText}`)
	}

	const text = await response.text()
	await writeFile(dest, text, 'utf-8')
	const lastModified = response.headers.get('last-modified') ?? ''
	if (lastModified) {
		await writeFile(metaFile, lastModified, 'utf-8')
	}

	return { text, cached: false }
}

async function main(): Promise<void> {
	const args = new Set(process.argv.slice(2))
	if (args.size && ![...args].every((a) => a === '--force' || a === '--write-lookup')) {
		throw new Error('Usage: node scripts/refresh_unicode_data.ts [--force] [--write-lookup]')
	}
	const force = args.has('--force')
	const writeLookup = args.has('--write-lookup')

	const cacheDir = path.resolve('scripts/unicode')
	await mkdir(cacheDir, { recursive: true })

	const unicodeDataPath = path.join(cacheDir, 'UnicodeData.txt')
	const blocksPath = path.join(cacheDir, 'Blocks.txt')
	const unicodeDataMeta = path.join(cacheDir, 'UnicodeData.etag')
	const blocksMeta = path.join(cacheDir, 'Blocks.etag')

	console.log(`Caching into ${cacheDir}${force ? ' (forced)' : ''}…`)

	const [unicodeData, blocks] = await Promise.all([
		fetchToCache(UNICODE_DATA_URL, unicodeDataPath, unicodeDataMeta, force),
		fetchToCache(BLOCKS_URL, blocksPath, blocksMeta, force),
	])
	console.log(
		`  UnicodeData.txt: ${unicodeData.cached ? 'cached' : 'fetched'} (${
			sha256(unicodeData.text).slice(0, 12)
		}…)`,
	)
	console.log(
		`  Blocks.txt:      ${blocks.cached ? 'cached' : 'fetched'} (${
			sha256(blocks.text).slice(0, 12)
		}…)`,
	)

	const unfiltered = buildUnicodeDataJson(unicodeData.text, blocks.text)
	const data = applyMaxCodepointCutoff(unfiltered)

	const jsonPath = path.join(cacheDir, 'data.json')
	const json = JSON.stringify(data, null, '\t')
	await writeFile(jsonPath, json, 'utf-8')

	const droppedNames = Object.keys(unfiltered.names).length - Object.keys(data.names).length
	const droppedInverse = Object.keys(unfiltered.namesInverse).length
		- Object.keys(data.namesInverse).length
	const droppedRanges = Object.keys(unfiltered.ranges).length - Object.keys(data.ranges).length
	const droppedBlocks = Object.keys(unfiltered.blocks).length - Object.keys(data.blocks).length

	console.log(`\nWrote ${jsonPath}`)
	console.log(`  version:        ${data.version}`)
	console.log(`  names:          ${Object.keys(data.names).length} (dropped ${droppedNames})`)
	console.log(
		`  namesInverse:   ${Object.keys(data.namesInverse).length} (dropped ${droppedInverse})`,
	)
	console.log(`  ranges:         ${Object.keys(data.ranges).length} (dropped ${droppedRanges})`)
	console.log(`  blocks:         ${Object.keys(data.blocks).length} (dropped ${droppedBlocks})`)
	console.log(`  cutoff:         ${MaxUnicodeCodepoint} (0x${MaxUnicodeCodepoint.toString(16)})`)

	if (writeLookup) {
		const lookupPath = path.resolve(
			'packages/core/src/dependency/unicode-lookup-table.json',
		)
		await mkdir(path.dirname(lookupPath), { recursive: true })
		await writeFile(lookupPath, json, 'utf-8')

		// Also update the BUNDLE_CHECKSUM marker in unicode.ts so the bundled
		// fallback's ETag stays in sync with the JSON contents.
		const unicodeTsPath = path.resolve(
			'packages/core/src/dependency/unicode.ts',
		)
		const checksum = sha256(json)
		const unicodeTs = await readFile(unicodeTsPath, 'utf-8')
		const updated = unicodeTs.replace(
			/(`bundle-)[0-9a-f]{64}(`)/,
			`$1${checksum}$2`,
		)
		if (updated === unicodeTs) {
			if (unicodeTs.includes('`bundle-')) {
				console.log(`  bundle checksum: ${checksum} (unchanged)`)
			} else {
				console.warn('[unicode] BUNDLE_CHECKSUM marker not found in unicode.ts')
			}
		} else {
			await writeFile(unicodeTsPath, updated, 'utf-8')
			console.log(`  bundle checksum: ${checksum} (updated in unicode.ts)`)
		}

		console.log(`  lookup mirror:  ${lookupPath}`)
	}
}

main().then(undefined, (e) => {
	console.error(e)
	process.exit(1)
})
