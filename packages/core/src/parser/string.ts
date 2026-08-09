import { localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import {
	BlocksUri,
	BulkBlocks,
	BulkNames,
	BulkNamesInverse,
	BulkRanges,
	codepointInAnyRange,
	isUnicodeNameLookupMap,
	isUnicodeNamesByCodepointMap,
	isUnicodeRangeMap,
	toTitleCase,
	UnicodeBulkCategory,
	UnicodeDataUri,
	UnicodeNameCategory,
} from '../dependency/index.js'
import type {
	Quote,
	StringNode,
	StringOptions,
	UnicodeEscapeKind,
	UnicodeEscapeNode,
} from '../node/index.js'
import { EscapeChar, EscapeTable, UnicodeEscapeChar, UnicodeEscapeLengths } from '../node/index.js'
import type { InfallibleParser } from '../parser/index.js'
import type { ParserContext } from '../service/index.js'
import type { IndexMap } from '../source/index.js'
import { Range, Source } from '../source/index.js'
import type { Parser, Result, Returnable } from './Parser.js'
import { Failure } from './Parser.js'

/**
 * Matches the content of a `\N{…}` escape that ends in a hex codepoint
 * suffix - e.g. `\N{Hangul Syllables D7A2}`. Vanilla Minecraft accepts this
 * form for codepoint ranges that use the First/Last marker pair (Hangul
 * Syllables, CJK Ideographs, etc.). The hex must lie within the range
 * identified by `name`.
 */
const NamedEscapeWithHexPattern = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s+([a-f0-9]+)\s*$/i

/**
 * Matches the content of a `\N{…}` escape: a Unicode character name with
 * optional surrounding whitespace. Each term must be a single `[a-z0-9-]+`
 * chunk separated by exactly one space - multi-space between terms is
 * rejected (matching vanilla Minecraft's behavior).
 */
const NamedEscapePattern = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s*$/i

/**
 * Returns the codepoint that `name` (case-insensitive) maps to, if any.
 *
 * Performs an O(1) lookup against the bulk {@link BulkNames} symbol, which
 * stores a `{ lowercased -> codepoint }` map.
 */
function lookupName(name: string, ctx: ParserContext): number | undefined {
	const map = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNames)
		.getData(isUnicodeNameLookupMap)
	return map?.[name.toLowerCase()]
}

/**
 * Returns the canonical Unicode name for `codepoint`, if known. Looks up the
 * codepoint → name reverse map populated by the Unicode dependency loader.
 */
function lookupNameByCodepoint(codepoint: number, ctx: ParserContext): string | undefined {
	const map = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
		.getData(isUnicodeNamesByCodepointMap)
	return map?.[codepoint.toString(16)]
}

/**
 * Renders a human-readable codepoint label, e.g. `U+1F514` or `U+0007`.
 * Uses uppercase hex with a minimum width of 4 to match the canonical
 * `\u`-escape format.
 */
function formatCodepoint(codepoint: number): string {
	return `U+${codepoint.toString(16).toUpperCase().padStart(4, '0')}`
}

/**
 * Returns a hover-friendly glyph for the resolved escape character.
 *
 * Non-printable controls (LF, CR, HT, etc.) would inject raw whitespace
 * into the markdown source and break the inline `[ … ]` layout, so they
 * are shown as their canonical C-style escape form instead. All other
 * characters are passed through verbatim.
 */
function displayGlyph(codepoint: number): { text: string; isEscapeForm: boolean } {
	switch (codepoint) {
		case 0x09:
			return { text: '\\t', isEscapeForm: true }
		case 0x0a:
			return { text: '\\n', isEscapeForm: true }
		case 0x0d:
			return { text: '\\r', isEscapeForm: true }
		case 0x00:
			return { text: '\\0', isEscapeForm: true }
		case 0x08:
			return { text: '\\b', isEscapeForm: true }
		case 0x0b:
			return { text: '\\v', isEscapeForm: true }
		case 0x0c:
			return { text: '\\f', isEscapeForm: true }
		case 0x1b:
			return { text: '\\e', isEscapeForm: true }
		case 0x07:
			return { text: '\\a', isEscapeForm: true }
		default:
			return { text: String.fromCodePoint(codepoint), isEscapeForm: false }
	}
}

/**
 * Builds the hover markdown shown when the cursor is over an escape
 * sequence. Output is a single inline line of the form:
 *
 *     [ <glyph> ] 'Name' - `U+XXXX`
 *
 * `<glyph>` is the resolved character for printable codepoints and the
 * C-style escape form (e.g. `\n`) for non-printable controls.
 *
 * The Unicode name is omitted when unknown.
 */
function buildEscapeHover(
	codepoint: number,
	name: string | undefined,
): string {
	const glyph = displayGlyph(codepoint)
	// Wrap the C-style escape form in backticks so it's rendered as code
	// (matching the visual treatment of the codepoint label) and so the
	// literal backslash doesn't get mistaken for markdown syntax.
	const glyphLabel = glyph.isEscapeForm ? `\`${glyph.text}\`` : glyph.text
	const head = `[ ${glyphLabel} ]`
	const codepointLabel = `\`${formatCodepoint(codepoint)}\``
	return name
		? `${head} '${toTitleCase(name)}' - ${codepointLabel}`
		: `${head} - ${codepointLabel}`
}

/**
 * Constructs a {@link UnicodeEscapeNode} for the source range
 * `[start, end)`, with the `hover` field pre-filled with the markdown
 * built from `resolved`/`codepoint`/`name`.
 */
function makeEscapeChild(
	start: number,
	end: number,
	resolved: string,
	codepoint: number,
	name: string | undefined,
	kind: UnicodeEscapeKind,
): UnicodeEscapeNode {
	return {
		type: 'unicode_escape',
		kind,
		range: Range.create(start, end),
		resolved,
		codepoint,
		name,
		hover: buildEscapeHover(codepoint, name),
	}
}

/**
 * Returns true if `codepoint` is valid per UnicodeData.txt. The codepoint
 * is considered valid when:
 * - it lies within one of the `<…, First>`/`<…, Last>` contiguous ranges, OR
 * - it is explicitly listed in `UnicodeData.txt` (any entry - real names,
 *   legacy Unicode 1.0 aliases, or placeholder names like `<control>`).
 */
function isValidUnicodeCodepoint(codepoint: number, ctx: ParserContext): boolean {
	const byCodepoint = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
		.getData(isUnicodeNamesByCodepointMap)
	const ranges = ctx.symbols.query(BlocksUri, UnicodeBulkCategory, BulkRanges)
		.getData(isUnicodeRangeMap)
	if (!byCodepoint || !ranges) {
		return false
	}
	if (codepointInAnyRange(codepoint, ranges)) {
		return true
	}
	return Object.prototype.hasOwnProperty.call(byCodepoint, codepoint.toString(16))
}

/**
 * Returns true if `codepoint` lies within a block declared in `Blocks.txt`.
 */
function isInDeclaredBlock(codepoint: number, ctx: ParserContext): boolean {
	const blocks = ctx.symbols.query(BlocksUri, UnicodeBulkCategory, BulkBlocks)
		.getData(isUnicodeRangeMap)
	return codepointInAnyRange(codepoint, blocks)
}

/**
 * Resolves a `\N{…}` escape to its codepoint, applying the full Unicode
 * validation pipeline. Returns `undefined` if the escape is invalid.
 *
 * Pipeline:
 * 1. Match the `name` pattern, or `name HEX` if the escape uses the
 *    hex-suffix form.
 * 2. Look up `name` in the Unicode name table (or in the blocks/ranges
 *    table when using the hex-suffix form).
 * 3. For the name form: verify the codepoint lies in a declared block and
 *    is a valid Unicode codepoint (in range or explicitly listed).
 * 4. For the hex-suffix form: verify the parsed hex codepoint lies within
 *    the matching block or range.
 *
 * Surrounding whitespace inside the braces is trimmed before validation
 * (vanilla accepts e.g. `\N{ snowman }`).
 */
function resolveNamedEscape(escape: string, src: Source, ctx: ParserContext): number | undefined {
	// Try the hex-suffix form first. If it matches but the resulting name
	// is not a known block/range (e.g. `\N{latin small letter a}` greedy-
	// matches as name="latin small letter", hex="a"), fall back to the
	// name-only form below.
	const hexMatch = NamedEscapeWithHexPattern.exec(escape)
	if (hexMatch) {
		const result = resolveHexSuffixedEscape(hexMatch[1]!, hexMatch[2]!, src, ctx)
		if (result !== undefined) {
			return result
		}
		// The hex-suffix form may have emitted a specific error (e.g. out-
		// of-range). Fall through to the name-only path so additional
		// errors can still be reported; multiple errors are acceptable.
	}
	// Detect a known range name with no hex codepoint provided, e.g.
	// `\N{Hangul Syllable }`. Emit a clearer error than the generic
	// "Unicode character name expected". Range symbols are registered with a
	// trailing space in their identifier (so completion inserts the space
	// automatically), so we probe both with and without.
	const rangeProbe = NamedEscapePattern.exec(escape)
	if (rangeProbe) {
		const rangeSymbol = ctx.symbols.query(
			UnicodeDataUri,
			UnicodeNameCategory,
			`${toTitleCase(rangeProbe[1]!)} `,
		).symbol
		if (rangeSymbol) {
			const data = rangeSymbol.data as UnicodeRangeSymbolData | undefined
			if (!data?.range) {
				return undefined
			}
			const [start, end] = data.range
			ctx.err.report(
				localize(
					'parser.string.hex-expected',
					rangeProbe[1]!,
					start.toString(16).toUpperCase(),
					end.toString(16).toUpperCase(),
				),
				Range.create(src, src.getCharRange(rangeProbe[1]!.length - 1).end),
			)
			return undefined
		}
	}
	// Detect a known range name with non-hex trailing content, e.g.
	// `\N{Hangul Syllables 0xAC00}` - the user typed something that looks
	// like a codepoint suffix but isn't valid hex. Suggest the first valid
	// codepoint in the range.
	const trailingMatch = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s+(.+?)\s*$/i.exec(escape)
	// Skip when trailing is valid hex - the out-of-range check above already
	// covers that case with a more specific message.
	if (trailingMatch && !/^[a-f0-9]+$/i.test(trailingMatch[2]!)) {
		const rangeSymbol = ctx.symbols.query(
			UnicodeDataUri,
			UnicodeNameCategory,
			`${toTitleCase(trailingMatch[1]!)} `,
		).symbol
		if (rangeSymbol) {
			const data = rangeSymbol.data as UnicodeRangeSymbolData | undefined
			if (data?.range) {
				const [start] = data.range
				const garbage = trailingMatch[2]!
				ctx.err.report(
					localize(
						'parser.string.invalid-codepoint-suffix',
						garbage,
						start.toString(16).toUpperCase(),
					),
					Range.create(
						src,
						src.getCharRange(trailingMatch[1]!.length + 1 + garbage.length - 1).end,
					),
				)
				return undefined
			}
		}
	}
	const match = NamedEscapePattern.exec(escape)
	if (!match) {
		return undefined
	}
	const name = match[1]!
	const codepoint = lookupName(name, ctx)
	if (codepoint === undefined) {
		return undefined
	}
	if (!isInDeclaredBlock(codepoint, ctx)) {
		return undefined
	}
	if (!isValidUnicodeCodepoint(codepoint, ctx)) {
		return undefined
	}
	return codepoint
}

interface UnicodeRangeSymbolData {
	range: [number, number]
	source: 'unicode-range'
	version: string
	lowercase: string
}

/**
 * Resolves a `\N{Name HEX}` escape.
 *
 * Vanilla Minecraft only accepts the hex-suffix form for codepoint ranges
 * that are explicitly marked with `<X, First>` and `<X, Last>` entries in
 * `UnicodeData.txt` (e.g. Hangul Syllables, CJK Ideographs). The matching
 * range names are registered as per-name symbols (with `data.range`) by
 * {@link symbolRegistrar}, so we look them up here.
 */
function resolveHexSuffixedEscape(
	name: string,
	hex: string,
	src: Source,
	ctx: ParserContext,
): number | undefined {
	// Range symbols are registered with a trailing space in their identifier
	// so completion inserts the space automatically. We probe both with and
	// without the trailing space to handle both completion and direct lookup.
	const query = ctx.symbols.query(
		UnicodeDataUri,
		UnicodeNameCategory,
		`${toTitleCase(name)} `,
	).symbol ?? ctx.symbols.query(
		UnicodeDataUri,
		UnicodeNameCategory,
		toTitleCase(name),
	).symbol
	if (!query) {
		return undefined
	}
	const data = query.data as UnicodeRangeSymbolData | undefined
	if (!data?.range) {
		return undefined
	}
	const [start, end] = data.range
	const codepoint = parseInt(hex, 16)
	if (Number.isNaN(codepoint) || codepoint < start || codepoint > end) {
		ctx.err.report(
			localize(
				'parser.string.out-of-range',
				toTitleCase(data.lowercase),
				start.toString(16).toUpperCase(),
				end.toString(16).toUpperCase(),
			),
			Range.create(src, src.getCharRange(name.length + 1 + hex.length - 1).end),
		)
		return undefined
	}
	return codepoint
}

export function string(options: StringOptions): InfallibleParser<StringNode> {
	return (src: Source, ctx: ParserContext): StringNode => {
		const ans: StringNode = {
			type: 'string',
			range: Range.create(src),
			options,
			value: '',
			valueMap: [],
			children: [],
		}
		let start: number

		if (options.quotes?.length && (src.peek() === '"' || src.peek() === "'")) {
			const currentQuote = src.read() as Quote
			ans.quote = currentQuote
			let cStart = src.cursor
			start = cStart
			while (src.canRead() && src.peek() !== currentQuote) {
				const c = src.peek()
				if (options.escapable && c === '\\') {
					src.skip()
					const c2 = src.read()
					if (
						c2 === '\\'
						|| c2 === currentQuote
						|| EscapeChar.is(options.escapable.characters, c2)
					) {
						const resolved = EscapeTable.get(c2)!
						ans.valueMap.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(cStart, src),
						})
						ans.value += resolved
						ans.children!.push(
							makeEscapeChild(
								cStart,
								src.cursor,
								resolved,
								resolved.codePointAt(0)!,
								lookupNameByCodepoint(resolved.codePointAt(0)!, ctx),
								c2 as UnicodeEscapeKind,
							),
						)
					} else if (
						options.escapable.unicode
						&& (c2 === 'u' || (options.escapable.extendedUnicode && UnicodeEscapeChar.is(c2)))
					) {
						const sequenceLength = UnicodeEscapeLengths.get(c2) ?? 4
						const hex = src.peek(sequenceLength)
						if (new RegExp(`^[0-9a-f]{${sequenceLength}}$`, 'i').test(hex)) {
							src.skip(sequenceLength)
							const codepoint = parseInt(hex, 16)
							// The hex regex matches any hex digits, so the
							// resulting value can exceed the Unicode max
							// (U+10FFFF). Treat out-of-range values as an
							// illegal escape the same way non-hex chars are.
							if (codepoint < 0 || codepoint > 0x10FFFF) {
								ctx.err.report(
									localize(
										'parser.string.illegal-unicode-escape-out-of-range',
										'0',
										`0x${(0x10FFFF).toString(16).toUpperCase()}`,
									),
									Range.create(cStart + 2, src),
								)
								ans.valueMap.push({
									inner: Range.create(ans.value.length, ans.value.length + 1),
									outer: Range.create(cStart, src),
								})
								ans.value += c2
								cStart = src.cursor
								continue
							}
							// `fromCodePoint` (not `fromCharCode`) so codepoints
							// outside the BMP — e.g. `\U0001F514` — survive intact.
							const resolved = String.fromCodePoint(codepoint)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += resolved
							ans.children!.push(
								makeEscapeChild(
									cStart,
									src.cursor,
									resolved,
									codepoint,
									lookupNameByCodepoint(codepoint, ctx),
									c2 as UnicodeEscapeKind,
								),
							)
						} else {
							// Highlight whatever chars are available before the
							// closing quote — the full hex slot when present
							// (`u1z3` for `\u1z34`), the truncated slot
							// (`kh` for `\ukh`), or the escape prefix
							// (`\u`/`\x`/`\U`) when nothing follows it.
							const closingQuote = src.string.indexOf(currentQuote, src.cursor)
							const charsLeft = closingQuote === -1
								? src.string.length - src.cursor
								: closingQuote - src.cursor
							const hexEnd = src.getCharRange(
								Math.min(sequenceLength, Math.max(charsLeft, 1)) - 1,
							).end
							const range = charsLeft > 0
								? Range.create(src, hexEnd)
								: Range.create(cStart, cStart + 2)
							ctx.err.report(
								localize('parser.string.illegal-unicode-escape'),
								range,
							)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += c2
						}
					} else if (options.escapable.extendedUnicode && c2 === 'N') {
						if (!src.trySkip('{')) {
							ctx.err.report(
								localize('expected', localeQuote('{')),
								src.getCharRange(-1),
							)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += c2
							cStart = src.cursor
							continue
						}
						const name = src.peekUntil('}')
						if (src.peek(1, name.length) !== '}') {
							ctx.err.report(
								localize('expected', localeQuote('}')),
								// Anchor on the full escape so the squiggle lands
								// on `\N{...` (or wherever it terminates), not
								// past the end of the string.
								Range.create(cStart, src),
							)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += c2
						} else {
							const codepoint = resolveNamedEscape(name, src, ctx)
							if (codepoint === undefined) {
								ctx.err.report(
									localize('parser.string.illegal-unicode-escape-name'),
									Range.create(cStart, src),
								)
								ans.valueMap.push({
									inner: Range.create(ans.value.length, ans.value.length + 1),
									outer: Range.create(cStart, src),
								})
								ans.value += c2
							} else {
								src.skip(name.length + 1)
								const resolved = String.fromCodePoint(codepoint)
								ans.valueMap.push({
									inner: Range.create(ans.value.length, ans.value.length + 1),
									outer: Range.create(cStart, src),
								})
								ans.value += resolved
								ans.children!.push(
									makeEscapeChild(
										cStart,
										src.cursor,
										resolved,
										codepoint,
										name,
										'N',
									),
								)
							}
						}
					} else {
						if (!options.escapable.allowUnknown) {
							ctx.err.report(
								localize('parser.string.illegal-escape', localeQuote(c2)),
								src.getCharRange(-1),
							)
						}
						ans.valueMap.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(cStart, src),
						})
						ans.value += c2
					}
					cStart = src.cursor
				} else {
					src.skip()
					const cEnd = src.cursor
					if (cEnd - cStart > 1) {
						ans.valueMap.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(cStart, cEnd),
						})
					}
					ans.value += c
					cStart = cEnd
				}
			}

			if (!src.trySkip(currentQuote)) {
				ctx.err.report(localize('expected', localeQuote(currentQuote)), src)
			}

			if (!options.quotes.includes(currentQuote)) {
				ctx.err.report(localize('parser.string.illegal-quote', options.quotes), ans)
			}
		} else if (options.unquotable) {
			start = src.cursor
			while (src.canRead() && isAllowedCharacter(src.peek(), options.unquotable)) {
				ans.value += src.read()
			}
			if (!ans.value && !options.unquotable.allowEmpty) {
				ctx.err.report(localize('expected', localize('string')), src)
			}
		} else {
			start = src.cursor
			ctx.err.report(localize('expected', options.quotes!), src)
		}

		ans.valueMap.unshift({ inner: Range.create(0), outer: Range.create(start) })

		if (options.value?.parser) {
			const valueResult = parseStringValue(options.value.parser, ans.value, ans.valueMap, ctx)
			/* istanbul ignore else */
			if (valueResult !== Failure) {
				ans.children!.push(valueResult)
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

export function parseStringValue<T extends Returnable>(
	parser: Parser<T>,
	value: string,
	map: IndexMap,
	ctx: ParserContext,
): Result<T> {
	const valueSrc = new Source(value, map)
	const valueCtx = {
		...ctx,
		doc: TextDocument.create(ctx.doc.uri, ctx.doc.languageId, ctx.doc.version, value),
	}
	// TODO: Mark trailing string as errors.
	return parser(valueSrc, valueCtx)
}

export const BrigadierUnquotableCharacters = Object.freeze(
	[
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
		'_',
		'.',
		'+',
		'-',
	] as const,
)
export const BrigadierUnquotableCharacterSet = new Set(BrigadierUnquotableCharacters)
export const BrigadierUnquotablePattern = /^[0-9A-Za-z_\.\+\-]*$/
export const BrigadierUnquotableOption = {
	allowEmpty: true,
	allowList: BrigadierUnquotableCharacterSet,
}

export const BrigadierStringOptions: StringOptions = {
	escapable: {},
	quotes: ['"', "'"],
	unquotable: BrigadierUnquotableOption,
}

export const brigadierString = string(BrigadierStringOptions)

export function isAllowedCharacter(
	c: string,
	options: Exclude<StringOptions['unquotable'], false | undefined>,
): boolean {
	return options.allowList?.has(c) ?? !options.blockList?.has(c)
}
