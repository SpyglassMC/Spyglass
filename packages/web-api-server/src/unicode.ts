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
 * Shape of the JSON served at `/unicode/data.json`.
 *
 * - `names`: lower-cased Unicode character name -> codepoint. Includes primary
 *   names from `UnicodeData.txt` field 1 (excluding `<…>` placeholders) and
 *   legacy Unicode 1.0 aliases from field 10. Deduped by codepoint (first
 *   name per codepoint wins).
 * - `ranges`: lower-cased `<…, First>`/`<…, Last>` pair name -> inclusive
 *   `[start, end]` codepoint range.
 * - `blocks`: lower-cased block name from `Blocks.txt` -> inclusive `[start, end]`.
 */
export interface UnicodeDataJson {
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
 * Parses the contents of `Blocks.txt`. Returns both a `{ blockName: [start,
 * end] }` map (for the JSON output) and a flat list of `{ start, end, name }`
 * entries (for resolving First/Last range pairs to their block name). Comment
 * lines (`#…`) are ignored.
 */
export function parseBlocks(text: string): {
	map: { [name: string]: [number, number] }
	list: { start: number; end: number; name: string }[]
} {
	const map: { [name: string]: [number, number] } = {}
	const list: { start: number; end: number; name: string }[] = []
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
	blocks: { start: number; end: number; name: string }[],
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
	const rangeStarts = new Map<string, number>()
	const ranges: { [name: string]: [number, number] } = {}
	// Track which codepoints have already been assigned a name so we keep
	// only the first (primary, then secondary alias) per codepoint.
	const named = new Set<number>()

	for (const e of entries) {
		if (!named.has(e.codepoint)) {
			// Real primary name (skip `<control>` / `<…, First>` / `<…, Last>`).
			if (e.primary && !e.primary.startsWith('<')) {
				names[e.primary.toLowerCase()] = e.codepoint
				named.add(e.codepoint)
			} else if (e.secondary) {
				// Legacy Unicode 1.0 alias - populates `names` for old
				// control chars whose primary is `<control>`.
				names[e.secondary.toLowerCase()] = e.codepoint
				named.add(e.codepoint)
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

	const data = buildUnicodeDataJson(unicodeDataText, blocksText)
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
