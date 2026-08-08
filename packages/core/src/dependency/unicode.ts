import type { Externals, Logger } from '../common/index.js'
import { fetchWithCache } from '../service/fetcher.js'
import type { SymbolRegistrar } from '../service/SymbolRegistrar.js'
import unicodeLookupTable from './unicode-lookup-table.json' with { type: 'json' }

/**
 * Non-`file:` URIs used by the {@link symbolRegistrar} as symbol-table identifiers.
 * They are never actually fetched as documents.
 */
export const UnicodeDataUri = 'spyglass://unicode/UnicodeData.json'
export const BlocksUri = 'spyglass://unicode/Blocks.json'

/**
 * Endpoint served by `api.spyglassmc.com` that exposes pre-parsed Unicode
 * data fetched from `https://www.unicode.org/Public/UNIDATA/`.
 *
 * Expected response shape:
 * ```json
 * {
 *   "version": "17.0.0",
 *   "names": { "latin small letter a": 97, ... },
 *   "namesInverse": { "61": ["LATIN SMALL LETTER A", ""], ... },
 *   "ranges": { "hangul syllable": [44032, 55203], ... },
 *   "blocks": { "basic latin": [0, 127], ... }
 * }
 * ```
 *
 * - `names`: lower-cased Unicode character name -> codepoint. Includes both
 *   primary names (from `UnicodeData.txt` field 1) and legacy Unicode 1.0
 *   aliases (field 10) for early control characters.
 * - `namesInverse`: codepoint (as hex string) -> `[primary, secondary]` raw
 *   tuple as it appears in `UnicodeData.txt`.
 * - `ranges`: lower-cased `<..., First>`/`<..., Last>` pair name -> inclusive
 *   `[start, end]` codepoint range. Used to validate that a codepoint lies
 *   in a recognized contiguous range.
 * - `blocks`: lower-cased block name from `Blocks.txt` -> inclusive `[start, end]`.
 */
export const UnicodeDataUrl = 'https://api.spyglassmc.com/unicode/data.json'

/**
 * Symbol categories used by the {@link symbolRegistrar}.
 */
export const UnicodeNameCategory = 'unicode-name'
export const UnicodeBulkCategory = 'unicode-data'

/**
 * Bulk symbol identifiers under {@link UnicodeBulkCategory}.
 *
 * - `BulkNames`: lower-cased Unicode name -> codepoint. Used for fast O(1)
 *   case-insensitive name lookup from the parser.
 * - `BulkNamesInverse`: hex codepoint -> `[primary, secondary]` raw tuple.
 *   Used to validate that a codepoint is explicitly listed in UnicodeData.txt.
 * - `BulkRanges`: `<…, First>`/`<…, Last>` pair name -> inclusive `[start, end]`.
 * - `BulkBlocks`: block name from `Blocks.txt` -> inclusive `[start, end]`.
 */
export const BulkNames = 'names'
export const BulkNamesInverse = 'names-inverse'
export const BulkRanges = 'ranges'
export const BulkBlocks = 'blocks'

export interface UnicodeData {
	version: string
	/** Lower-cased name -> codepoint. */
	names: { [name: string]: number }
	/** Hex codepoint (no leading `0x`) -> `[primary, secondary]` raw UnicodeData.txt fields. */
	namesInverse: { [hex: string]: [string, string] }
	/** Lower-cased `<…, First>`/`<…, Last>` range name -> inclusive `[start, end]`. */
	ranges: { [name: string]: [number, number] }
	/** Lower-cased block name from `Blocks.txt` -> inclusive `[start, end]`. */
	blocks: { [name: string]: [number, number] }
}

export interface UnicodeDataResult extends UnicodeData {
	checksum: string
}

/**
 * JDK-specific character-name aliases that vanilla Minecraft's Java runtime
 * accepts via `Character.getName()` but which are not present (or differ) in
 * the Unicode `UnicodeData.txt`. Keys must be lower-case.
 *
 * These are registered with `source: 'jdk'` and take precedence over the
 * Unicode entries on conflict (registered last -> `amendSymbol` replaces data).
 */
export const JdkNameOverrides: { [name: string]: number } = Object.freeze({
	// Common control-character aliases accepted by `Character.getName()`.
	'null': 0x0000,
	'tab': 0x0009,
	'newline': 0x000a,
	'carriage return': 0x000d,
	'backspace': 0x0008,
	'escape': 0x001b,
	'delete': 0x007f,
	// `bell` is mapped to U+0007 by the JDK even though Unicode 6.0+
	// repurposed the name for U+1F514 (🔔). The JDK entry wins.
	'bell': 0x0007,
	// Java-only names for unassigned C1 control characters (U+0080, U+0081,
	// U+0099). These codepoints have `<control>` as their only UnicodeData.txt
	// entry - no secondary name - so the JDK names are the only way to address
	// them.
	'padding character': 0x0080,
	'high octet preset': 0x0081,
	'single graphic character introducer': 0x0099,
})

/**
 * Fetches the combined Unicode data file from the `api.spyglassmc.com`
 * mirror, falling back to the vendored `unicode-lookup-table.json` bundle
 * when the network request fails.
 *
 * The bundled fallback is a temporary stopgap so the parser can run offline
 * / before the API is deployed. To remove later:
 *   1. Delete the `import unicodeLookupTable from ...` line at the top.
 *   2. Delete `getUnicodeDataFromBundle` and the `catch` branch below.
 *   3. Optionally delete `packages/core/src/dependency/unicode-lookup-table.json`.
 *
 * @throws Only when both the API and the bundle are unavailable (which
 * shouldn't happen - the bundle is compiled into the package).
 */
export async function getUnicodeData(
	externals: Externals,
	logger: Logger,
): Promise<UnicodeDataResult> {
	try {
		return await getUnicodeDataFromApi(externals, logger)
	} catch (e) {
		logger.warn(
			{ err: e },
			'[unicode] Failed fetching from API; falling back to bundled data',
		)
		return getUnicodeDataFromBundle()
	}
}

async function getUnicodeDataFromApi(
	externals: Externals,
	logger: Logger,
): Promise<UnicodeDataResult> {
	const response = await fetchWithCache(externals, logger, UnicodeDataUrl)
	const data = (await response.json()) as UnicodeData
	return {
		...data,
		checksum: `${response.headers.get('etag') ?? ''}-v1`,
	}
}

function getUnicodeDataFromBundle(): UnicodeDataResult {
	const data = unicodeLookupTable as unknown as UnicodeData
	return {
		version: data.version,
		names: data.names,
		namesInverse: data.namesInverse,
		ranges: data.ranges,
		blocks: data.blocks,
		// BUNDLE_CHECKSUM - updated by scripts/refresh_unicode_data.ts --write-lookup
		checksum: `bundle-7912693b2a919382662e46f22919e9ed9601d15879f33a03e2ff33f4c67b3df1`,
	}
}

/**
 * Capitalizes the first letter of every whitespace or hyphen-separated term
 * in `name`. Used to format symbol identifiers for completion items - e.g.
 * `"snowman"` -> `"Snowman"`, `"latin small letter a"` -> `"Latin Small Letter A"`,
 * `"khitan small script character-18cff"` -> `"Khitan Small Script Character-18Cff"`.
 */
export function toTitleCase(name: string): string {
	return name.replace(
		/(^|[\s-])([a-z])/g,
		(_, prefix: string, letter: string) => prefix + letter.toUpperCase(),
	)
}

/**
 * Builds a {@link SymbolRegistrar} that exposes Unicode data and blocks in
 * the global symbol table.
 *
 * Symbol layout:
 * - One symbol per name under {@link UnicodeNameCategory}, with the identifier
 *   formatted in Title Case (e.g. `"Snowman"`, `"Latin Small Letter A"`) so
 *   completion items display in human-readable form. `data = { codepoint,
 *   source, version, lowercase }` - the `lowercase` field is the original
 *   lower-cased name used as the lookup key.
 * - Four bulk symbols under {@link UnicodeBulkCategory}:
 *   - `{@link BulkNames}` -> lower-cased name -> codepoint (for fast lookup)
 *   - `{@link BulkNamesInverse}` -> codepoint -> `[primary, secondary]` entry
 *   - `{@link BulkRanges}` -> `<…, First>`/`<…, Last>` pairs
 *   - `{@link BulkBlocks}` -> block name -> `[start, end]`
 *
 * JDK aliases (see {@link JdkNameOverrides}) are entered last under the name
 * category so they win on conflict (amend replaces `data`).
 */
export function symbolRegistrar(data: UnicodeData): SymbolRegistrar {
	return (symbols) => {
		symbols.contributeAs('symbol_registrar/unicode-data', () => {
			const registerName = (name: string, codepoint: number, source: 'unicode' | 'jdk') => {
				symbols.query(UnicodeDataUri, UnicodeNameCategory, toTitleCase(name))
					.enter({
						data: {
							data: {
								codepoint,
								source,
								version: data.version,
								lowercase: name,
							},
						},
						// Add a dummy definition so the per-name symbols aren't
						// trimmed by `SymbolUtil.trim()` during binder passes.
						usage: { type: 'definition' },
					})
			}
			for (const [name, codepoint] of Object.entries(data.names)) {
				registerName(name, codepoint, 'unicode')
			}
			for (const [name, codepoint] of Object.entries(JdkNameOverrides)) {
				registerName(name, codepoint, 'jdk')
			}
			// Register each First/Last range name as a Title Case per-name symbol
			// so it appears in completion alongside individual character names.
			// The identifier includes a trailing space so accepting the
			// completion drops the user directly into the hex codepoint slot.
			// Data is `{ range: [start, end] }` so the parser can validate
			// `\N{Name HEX}` against the actual range and report it in errors.
			for (const [name, range] of Object.entries(data.ranges)) {
				symbols.query(UnicodeDataUri, UnicodeNameCategory, `${toTitleCase(name)} `)
					.enter({
						data: {
							data: {
								range,
								source: 'unicode-range',
								version: data.version,
								lowercase: name,
							},
						},
						usage: { type: 'definition' },
					})
			}
			symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNames)
				.enter({
					data: { data: data.names },
					// The bulk symbols have no per-file locations, but `clear()` +
					// `trim()` removes trimmable symbols (no locations at all) on
					// every binder pass. Adding a dummy definition keeps them
					// rooted in the global table.
					usage: { type: 'definition' },
				})
			symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
				.enter({
					data: { data: data.namesInverse },
					usage: { type: 'definition' },
				})
			symbols.query(BlocksUri, UnicodeBulkCategory, BulkRanges)
				.enter({
					data: { data: data.ranges },
					usage: { type: 'definition' },
				})
			symbols.query(BlocksUri, UnicodeBulkCategory, BulkBlocks)
				.enter({
					data: { data: data.blocks },
					usage: { type: 'definition' },
				})
		})
	}
}

/* istanbul ignore next */
/**
 * Helpers usable by consumers (e.g. `parser/string.ts`) to perform the
 * Unicode escape validation pipeline.
 */

/** A UnicodeName symbol's `data` payload. */
export interface UnicodeNameSymbolData {
	codepoint: number
	source: 'unicode' | 'jdk'
	version: string
	/** Lower-cased form of the symbol identifier (used as the lookup key). */
	lowercase: string
}

export function isUnicodeNameSymbolData(value: unknown): value is UnicodeNameSymbolData {
	return typeof value === 'object'
		&& value !== undefined
		&& typeof (value as UnicodeNameSymbolData).codepoint === 'number'
}

export type UnicodeNameLookupMap = { [lowerName: string]: number }
export type UnicodeInverseMap = { [hex: string]: [string, string] }
export type UnicodeRangeMap = { [name: string]: [number, number] }

export function isUnicodeNameLookupMap(value: unknown): value is UnicodeNameLookupMap {
	return typeof value === 'object' && value !== undefined
}

export function isUnicodeInverseMap(value: unknown): value is UnicodeInverseMap {
	return typeof value === 'object' && value !== undefined
}

export function isUnicodeRangeMap(value: unknown): value is UnicodeRangeMap {
	return typeof value === 'object' && value !== undefined
}

/**
 * Returns true if `codepoint` lies in any `[start, end]` range in `map`.
 */
export function codepointInAnyRange(
	codepoint: number,
	map: UnicodeRangeMap | undefined,
): boolean {
	if (!map) {
		return false
	}
	for (const range of Object.values(map)) {
		if (codepoint >= range[0] && codepoint <= range[1]) {
			return true
		}
	}
	return false
}
