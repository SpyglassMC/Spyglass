import cors from 'cors'
import express from 'express'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { Logger } from 'pino'
import { sendLocalFile, userAgentEnforcer } from './utils.js'

const UNICODE_DATA_URL = 'https://www.unicode.org/Public/UNIDATA/UnicodeData.txt'
const BLOCKS_URL = 'https://www.unicode.org/Public/UNIDATA/Blocks.txt'
const FETCH_TIMEOUT_MS = 30_000

/**
 * Highest codepoint (inclusive) served at `/unicode/data.json`. Vanilla
 * Minecraft's Java runtime caps the supported code point range at U+101759
 * (the last entry of the Tangut Supplement block); codepoints at or after
 * U+101760 (TANGUT COMPONENTS SUPPLEMENT) are dropped from `names`,
 * `namesInverse`, `blocks`, and `ranges`.
 */
export const MaxUnicodeCodepoint = 101759

/**
 * Shape of the JSON served at `/unicode/data.json`.
 *
 * - `names`: lower-cased Unicode character name -> codepoint. Includes primary
 *   names from `UnicodeData.txt` field 1 (excluding `<…>` placeholders) and
 *   legacy Unicode 1.0 aliases from field 10.
 * - `namesInverse`: codepoint (hex string, no `0x`) -> `[primary, secondary]`.
 * - `ranges`: lower-cased `<…, First>`/`<…, Last>` pair name -> inclusive
 *   `[start, end]` codepoint range.
 * - `blocks`: lower-cased block name from `Blocks.txt` -> inclusive `[start, end]`.
 */
export interface UnicodeDataJson {
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

/**
 * Parses the contents of `UnicodeData.txt` into a list of `(codepoint, primary, secondary)`
 * entries. Skips blank lines.
 */
export function parseUnicodeDataEntries(text: string): ParsedEntry[] {
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

/**
 * Parses the contents of `Blocks.txt` into a `{ blockName: [start, end] }` map.
 * Comment lines (`#…`) are ignored.
 */
export function parseBlocks(text: string): { [name: string]: [number, number] } {
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

/**
 * Extracts the Unicode version (e.g. `"17.0.0"`) from the header line of
 * `Blocks.txt`. Returns `"unknown"` if the header is missing.
 */
export function parseUnicodeVersion(blocksText: string): string {
	const m = blocksText.match(/^# Blocks-(\d+\.\d+\.\d+)\.txt/m)
	return m?.[1] ?? 'unknown'
}

/**
 * Combines the parsed entries + blocks into the {@link UnicodeDataJson} shape.
 * Pure function - no I/O.
 */
export function buildUnicodeDataJson(
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
		// Real primary name (skip `<control>` / `<…, First>` / `<…, Last>`).
		if (e.primary && !e.primary.startsWith('<')) {
			const key = e.primary.toLowerCase()
			if (!(key in names)) {
				names[key] = e.codepoint
			}
		}
		// Legacy Unicode 1.0 alias - populates `names` for old control chars.
		if (e.secondary) {
			const key = e.secondary.toLowerCase()
			if (!(key in names)) {
				names[key] = e.codepoint
			}
		}
		// First/Last range markers.
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

/**
 * Removes all entries with codepoints at or above `MaxUnicodeCodepoint`.
 *
 * - `names` and `namesInverse`: entries with codepoint > `MaxUnicodeCodepoint` are dropped.
 * - `blocks`: a block whose entire range exceeds the cutoff is dropped. Blocks
 *   whose start is at or below the cutoff but end is above are clamped to
 *   `[start, MaxUnicodeCodepoint]` (this case does not currently arise in
 *   practice - `Blocks.txt` defines non-overlapping ranges that align to the
 *   cutoff boundary - but the clamp is kept as a defensive measure).
 * - `ranges`: range entries whose start is above the cutoff are dropped.
 */
export function applyMaxCodepointCutoff(data: UnicodeDataJson): UnicodeDataJson {
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
		const cp = parseInt(hex, 16)
		if (cp <= cutoff) {
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

	return {
		version: data.version,
		names,
		namesInverse,
		ranges,
		blocks,
	}
}

/**
 * SHA-256 hex digest of `text`, suitable for use as a strong ETag.
 */
export function sha256(text: string): string {
	return createHash('sha256').update(text).digest('hex')
}

/**
 * Fetches UnicodeData.txt + Blocks.txt from upstream (using a `Last-Modified`
 * conditional request so unchanged files are skipped), parses them, writes
 * the resulting minified JSON to `dir/data.json`, and returns the SHA-256
 * ETag of the written file plus the parsed JSON.
 *
 * On any fetch/parse failure, the existing on-disk files are left untouched
 * and the error is re-thrown so callers can decide how to handle it.
 *
 * Mirrors the `sendGitFile` pattern used by the mcmeta / vanilla-mcdoc
 * routes: cache upstream bytes in `${dir}/.cache/`, parse to `${dir}/data.json`,
 * compute a strong ETag from the on-disk content.
 */
export async function refreshUnicodeData(
	logger: Logger,
	dir: string,
): Promise<{ etag: string; data: UnicodeDataJson; filePath: string }> {
	const cacheDir = path.join(dir, '.cache')
	await fs.mkdir(cacheDir, { recursive: true })

	const [unicodeDataText, blocksText] = await Promise.all([
		fetchAndCache(UNICODE_DATA_URL, path.join(cacheDir, 'UnicodeData.txt'), logger),
		fetchAndCache(BLOCKS_URL, path.join(cacheDir, 'Blocks.txt'), logger),
	])

	const data = applyMaxCodepointCutoff(buildUnicodeDataJson(unicodeDataText, blocksText))
	const json = JSON.stringify(data)
	const etag = `"${sha256(json)}"`

	const filePath = path.join(dir, 'data.json')
	const existing = await fs.stat(filePath).catch(() => undefined)
	const existingEtag = existing
		? await sha256OfFile(filePath).then((h) => `"${h}"`).catch(() => undefined)
		: undefined
	if (existingEtag === etag) {
		logger.info({ dir, etag }, '[unicode] data.json unchanged; skipping rewrite')
		return { etag, data, filePath }
	}

	await fs.writeFile(filePath, json)
	logger.info(
		{ dir, etag, version: data.version, bytes: json.length },
		'[unicode] wrote data.json',
	)
	return { etag, data, filePath }
}

/**
 * Conditional fetch using `Last-Modified`. Writes the response body to
 * `dest` and stores the upstream `Last-Modified` timestamp in
 * `${dest}.lastmod` for subsequent runs. Returns the (possibly freshly
 * fetched) file contents.
 *
 * We deliberately use `Last-Modified` rather than ETag because
 * `unicode.org`'s CDN does not honour weak ETags consistently across
 * requests (gzip representation differences cause mismatches).
 */
async function fetchAndCache(
	url: string,
	dest: string,
	logger: Logger,
): Promise<string> {
	const metaPath = `${dest}.lastmod`
	let cachedLastModified: string | undefined
	try {
		const line = (await fs.readFile(metaPath, 'utf-8')).trim()
		cachedLastModified = line || undefined
	} catch {
		// No cached metadata yet -> cold fetch.
	}

	const headers: Record<string, string> = {
		'User-Agent': 'SpyglassMC (+https://spyglassmc.com)',
	}
	if (cachedLastModified) {
		headers['If-Modified-Since'] = cachedLastModified
	}

	const response = await fetch(url, {
		headers,
		signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
	})

	if (response.status === 304) {
		logger.debug({ url }, '[unicode] upstream unchanged; reusing cache')
		return fs.readFile(dest, 'utf-8')
	}
	if (!response.ok) {
		throw new Error(`Failed fetching ${url}: ${response.status} ${response.statusText}`)
	}

	const text = await response.text()
	await fs.writeFile(dest, text, 'utf-8')
	const lastModified = response.headers.get('last-modified')
	if (lastModified) {
		await fs.writeFile(metaPath, lastModified, 'utf-8')
	}
	logger.debug({ url, bytes: text.length }, '[unicode] fetched and cached')
	return text
}

async function sha256OfFile(filePath: string): Promise<string> {
	return sha256(await fs.readFile(filePath, 'utf8'))
}

/**
 * Returns the cached ETag + file path if `data.json` exists on disk, or
 * `undefined` if not.
 */
export async function readCachedUnicodeData(
	dir: string,
): Promise<{ etag: string; data: UnicodeDataJson; filePath: string } | undefined> {
	const filePath = path.join(dir, 'data.json')
	try {
		const text = await fs.readFile(filePath, 'utf8')
		return {
			etag: `"${sha256(text)}"`,
			data: JSON.parse(text) as UnicodeDataJson,
			filePath,
		}
	} catch (e) {
		if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
			return undefined
		}
		throw e
	}
}

export interface CreateUnicodeAppOptions {
	/**
	 * When `true`, kicks off a background refresh of `data.json` from upstream.
	 * Defaults to `false` - useful for tests that seed the directory themselves.
	 */
	refresh?: boolean
}

/**
 * Returns a standalone Express app serving `GET /unicode/data.json`.
 *
 * The returned app mirrors the production middleware stack (`cors`, default
 * cache headers, `nosniff`, `User-Agent` enforcement) so tests exercise the
 * same code path as production.
 *
 * The `dir` argument is the directory where `data.json` is read from and
 * written to. If the file is missing and `options.refresh` is `true`, the
 * route will return `503` until the background refresh completes.
 */
export async function createUnicodeApp(
	dir: string,
	logger: Logger,
	options: CreateUnicodeAppOptions = {},
) {
	await fs.mkdir(dir, { recursive: true })

	let etag: string | undefined
	const cached = await readCachedUnicodeData(dir)
	if (cached) {
		etag = cached.etag
		logger.info({ etag, version: cached.data.version }, '[unicode] loaded cached data.json')
	} else if (!options.refresh) {
		logger.warn('[unicode] no cached data.json; pass `refresh: true` to fetch from upstream')
	}

	if (options.refresh) {
		void (async () => {
			try {
				const result = await refreshUnicodeData(logger, dir)
				etag = result.etag
				logger.info(
					{ etag: result.etag, version: result.data.version },
					'[unicode] data.json ready',
				)
			} catch (e) {
				logger.error({ err: e }, '[unicode] background refresh failed')
			}
		})()
	}

	const filePath = path.join(dir, 'data.json')
	const app = express()
		.use(cors({ exposedHeaders: ['ETag'] }))
		.use((_req, res, next) => {
			res.setHeader('Cache-Control', 'max-age=0')
			res.contentType('application/json')
			res.appendHeader('X-Content-Type-Options', 'nosniff')
			next()
		})
		.use(userAgentEnforcer)
		.get('/unicode/data.json', async (req, res) => {
			if (!etag) {
				res.status(503).send(JSON.stringify({ message: 'Unicode data not yet available' }))
				return
			}
			await sendLocalFile(req, res, filePath, etag)
		})

	return { app, getEtag: () => etag }
}
