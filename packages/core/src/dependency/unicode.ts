import type { SymbolRegistrar } from '../service/SymbolRegistrar.js'
import unicodeLookupTable from './unicode-lookup-table.json' with { type: 'json' }

/**
 * Non-`file:` URIs used by the {@link symbolRegistrar} as symbol-table identifiers.
 * They are never actually fetched as documents.
 */
export const UnicodeDataUri = 'spyglass://unicode/UnicodeData.json'
export const BlocksUri = 'spyglass://unicode/Blocks.json'

/**
 * Pre-parsed Unicode data vendored from
 * `https://www.unicode.org/Public/UNIDATA/` (`UnicodeData.txt` +
 * `Blocks.txt`), bundled as `unicode-lookup-table.json`.
 *
 * Regenerate with `npm run refresh-unicode-data`, which rewrites both the
 * JSON file and the `BUNDLE_CHECKSUM` marker below.
 *
 * Shape:
 * ```json
 * {
 *   "version": "17.0.0",
 *   "names": { "latin small letter a": 97, ... },
 *   "ranges": { "hangul syllable": [44032, 55203], ... },
 *   "blocks": { "basic latin": [0, 127], ... }
 * }
 * ```
 *
 * - `names`: lower-cased Unicode character name -> codepoint. Includes both
 *   primary names (from `UnicodeData.txt` field 1) and legacy Unicode 1.0
 *   aliases (field 10) for early control characters. Deduped by codepoint
 *   (first name seen per codepoint wins).
 * - `ranges`: lower-cased `<..., First>`/`<..., Last>` pair name -> inclusive
 *   `[start, end]` codepoint range. Used to validate that a codepoint lies
 *   in a recognized contiguous range.
 * - `blocks`: lower-cased block name from `Blocks.txt` -> inclusive `[start, end]`.
 */

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
 * - `BulkNamesInverse`: hex codepoint -> lower-cased name. Built at runtime
 *   in {@link symbolRegistrar} by reversing `names`. Used to validate that a
 *   codepoint is explicitly listed in UnicodeData.txt.
 * - `BulkRanges`: `<…, First>`/`<…, Last>` pair name -> inclusive `[start, end]`.
 * - `BulkBlocks`: block name from `Blocks.txt` -> inclusive `[start, end]`.
 */
export const BulkNames = 'names'
export const BulkNamesInverse = 'names-inverse'
export const BulkRanges = 'ranges'
export const BulkBlocks = 'blocks'

export interface UnicodeData {
	version: string
	/** Lower-cased name -> codepoint. Deduped by codepoint (first name per codepoint wins). */
	names: { [name: string]: number }
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
	'bel': 0x0007,
	'padding character': 0x0080,
	'high octet preset': 0x0081,
	'single graphic character introducer': 0x0099,
})

/**
 * Reads the bundled Unicode data from `unicode-lookup-table.json`.
 *
 * The `checksum` is a build-time digest of the JSON file, used by
 * `meta.registerSymbolRegistrar` to invalidate the cached symbol table
 * whenever the bundled data is regenerated.
 */
export function getUnicodeData(): UnicodeDataResult {
	const data = unicodeLookupTable as unknown as UnicodeData
	return {
		version: data.version,
		names: data.names,
		ranges: data.ranges,
		blocks: data.blocks,
		// BUNDLE_CHECKSUM - updated by scripts/refresh_unicode_data.ts
		checksum: `bundle-bb300b090da8dcdfa7c3563711150f1a8c3b4535e93331021a0fa87027809136`,
	}
}

/**
 * Capitalizes the first letter of every whitespace or hyphen-separated term
 * in `name`. Used to format symbol identifiers for completion items - e.g.
 * `"snowman"` -> `"Snowman"`, `"latin small letter a"` -> `"Latin Small Letter A"`,
 * `"khitan small script character-18cff"` -> `"Khitan Small Script Character-18cff"`.
 *
 * Only the first letter of each word is capitalized, and only when the
 * word actually starts with a letter. Words that begin with a digit (e.g.
 * `"18cff"`) or other non-letter stay untouched.
 *
 * Parenthesized abbreviations are kept uppercase so legacy aliases render
 * naturally: `"line feed (lf)"` -> `"Line Feed (LF)"`.
 */
export function toTitleCase(name: string): string {
	return name.replace(
		/(^|[\s-])([a-z])/g,
		(_, prefix: string, letter: string) => prefix + letter.toUpperCase(),
	).replace(
		/\(([a-z]+)\)/g,
		(_, abbr: string) => `(${abbr.toUpperCase()})`,
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
 *   - `{@link BulkNames}` -> lower-cased name -> codepoint (Unicode names
 *     merged with {@link JdkNameOverrides} so the parser can resolve
 *     `\N{...}` for JDK-only aliases; JDK entries last, win on conflict)
 *   - `{@link BulkNamesInverse}` -> hex codepoint -> lower-cased name (built
 *     by reversing the merged map, so JDK codepoints validate too)
 *   - `{@link BulkRanges}` -> `<…, First>`/`<…, Last>` pairs
 *   - `{@link BulkBlocks}` -> block name -> `[start, end]`
 *
 * JDK aliases (see {@link JdkNameOverrides}) are also entered last under
 * the name category so they win on conflict (amend replaces `data`).
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
			const allNames: UnicodeNameLookupMap = { ...data.names, ...JdkNameOverrides }

			const namesByCodepoint: UnicodeNamesByCodepointMap = {}
			for (const [name, codepoint] of Object.entries(allNames)) {
				namesByCodepoint[codepoint.toString(16)] = name
			}
			symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNames)
				.enter({
					data: { data: allNames },
					usage: { type: 'definition' },
				})
			symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
				.enter({
					data: { data: namesByCodepoint },
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
export type UnicodeNamesByCodepointMap = { [hex: string]: string }
export type UnicodeRangeMap = { [name: string]: [number, number] }

export function isUnicodeNameLookupMap(value: unknown): value is UnicodeNameLookupMap {
	return typeof value === 'object' && value !== undefined
}

export function isUnicodeNamesByCodepointMap(
	value: unknown,
): value is UnicodeNamesByCodepointMap {
	return typeof value === 'object' && value !== undefined && !Array.isArray(value)
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
