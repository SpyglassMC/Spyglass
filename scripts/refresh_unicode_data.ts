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
import { fileURLToPath } from 'node:url'

const UNICODE_DATA_URL = 'https://www.unicode.org/Public/UNIDATA/UnicodeData.txt'
const BLOCKS_URL = 'https://www.unicode.org/Public/UNIDATA/Blocks.txt'
const FETCH_TIMEOUT_MS = 30_000
const USER_AGENT = 'SpyglassMC (+https://spyglassmc.com)'

// Mirror packages/web-api-server/src/unicode.ts -> MaxUnicodeCodepoint.
const MaxUnicodeCodepoint = 101759

interface UnicodeDataJson {
	version: string
	names: { [name: string]: number }
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

interface ParsedBlock {
	start: number
	end: number
	name: string
}

function parseBlocks(text: string): {
	map: { [name: string]: [number, number] }
	list: ParsedBlock[]
} {
	const map: { [name: string]: [number, number] } = {}
	const list: ParsedBlock[] = []
	for (const line of text.split('\n')) {
		if (!line || line.startsWith('#')) {
			continue
		}
		const m = line.match(/^([0-9A-F]+)\.\.([0-9A-F]+);\s*(.+)$/)
		if (m) {
			const name = m[3]!.trim().toLowerCase()
			const start = parseInt(m[1]!, 16)
			const end = parseInt(m[2]!, 16)
			map[name] = [start, end]
			list.push({ start, end, name })
		}
	}
	return { map, list }
}

/**
 * Maps a `<X, First>`/`<X, Last>` pair's range to its canonical `Blocks.txt`
 * block name. Vanilla Minecraft's hex-suffix form uses block names (e.g.
 * `Hangul Syllables`, plural) while `UnicodeData.txt` lists the First/Last
 * pair name (e.g. `Hangul Syllable`, singular). Resolution:
 *   1. Exact `[start, end]` match in Blocks.txt -> use that block name
 *   2. Smallest containing block -> use that block name (range is a subset)
 *   3. No match -> fall back to the original First/Last name
 */
function resolveBlockName(
	start: number,
	end: number,
	fallback: string,
	blocks: ParsedBlock[],
): string {
	const exact = blocks.find(b => b.start === start && b.end === end)
	if (exact) {
		return exact.name
	}
	const containing = blocks
		.filter(b => b.start <= start && end <= b.end)
		.sort((a, b) => (a.end - a.start) - (b.end - b.start))
	if (containing.length) {
		return containing[0]!.name
	}
	return fallback
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
	const rangeStarts = new Map<string, number>()
	const ranges: { [name: string]: [number, number] } = {}
	// Track which codepoints have already been assigned a name so we keep
	// only the first (primary, then secondary alias) per codepoint.
	const named = new Set<number>()

	for (const e of entries) {
		if (!named.has(e.codepoint)) {
			if (e.primary && !e.primary.startsWith('<')) {
				names[e.primary.toLowerCase()] = e.codepoint
				named.add(e.codepoint)
			} else if (e.secondary) {
				names[e.secondary.toLowerCase()] = e.codepoint
				named.add(e.codepoint)
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
				const blockName = resolveBlockName(
					start,
					e.codepoint,
					lastMatch[1]!.toLowerCase(),
					blocks.list,
				)
				ranges[blockName] = [start, e.codepoint]
				rangeStarts.delete(lastMatch[1]!)
			}
		}
	}

	return {
		version: parseUnicodeVersion(blocksText),
		names,
		ranges,
		blocks: blocks.map,
	}
}

/**
 * Removes all entries with codepoints at or above `MaxUnicodeCodepoint`.
 *
 * - `names` and `ranges`: entries with codepoint > `MaxUnicodeCodepoint` are dropped.
 * - `blocks`: a block whose entire range exceeds the cutoff is dropped. Blocks
 *   whose start is at or below the cutoff but end is above are clamped to
 *   `[start, MaxUnicodeCodepoint]` (this case does not currently arise in
 *   practice - `Blocks.txt` defines non-overlapping ranges that align to the
 *   cutoff boundary - but the clamp is kept as a defensive measure).
 */
function applyMaxCodepointCutoff(data: UnicodeDataJson): UnicodeDataJson {
	const cutoff = MaxUnicodeCodepoint
	const names: { [name: string]: number } = {}
	const ranges: { [name: string]: [number, number] } = {}
	const blocks: { [name: string]: [number, number] } = {}

	for (const [name, codepoint] of Object.entries(data.names)) {
		if (codepoint <= cutoff) {
			names[name] = codepoint
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

	return { version: data.version, names, ranges, blocks }
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

	// Anchor paths to the script's location so the script works regardless of
	// the caller's cwd. Resolve via import.meta.url -> repo root, then build
	// absolute paths to the cache + vendored lookup table.
	const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

	const cacheDir = path.join(repoRoot, 'scripts/unicode')
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
	const droppedRanges = Object.keys(unfiltered.ranges).length - Object.keys(data.ranges).length
	const droppedBlocks = Object.keys(unfiltered.blocks).length - Object.keys(data.blocks).length

	console.log(`\nWrote ${jsonPath}`)
	console.log(`  version:        ${data.version}`)
	console.log(`  names:          ${Object.keys(data.names).length} (dropped ${droppedNames})`)
	console.log(`  ranges:         ${Object.keys(data.ranges).length} (dropped ${droppedRanges})`)
	console.log(`  blocks:         ${Object.keys(data.blocks).length} (dropped ${droppedBlocks})`)
	console.log(`  cutoff:         ${MaxUnicodeCodepoint} (0x${MaxUnicodeCodepoint.toString(16)})`)

	if (writeLookup) {
		const lookupPath = path.join(
			repoRoot,
			'packages/core/src/dependency/unicode-lookup-table.json',
		)
		await mkdir(path.dirname(lookupPath), { recursive: true })
		await writeFile(lookupPath, json, 'utf-8')

		// Also update the BUNDLE_CHECKSUM marker in unicode.ts so the bundled
		// fallback's ETag stays in sync with the JSON contents.
		const unicodeTsPath = path.join(
			repoRoot,
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
