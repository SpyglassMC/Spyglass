import { localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import {
	BlocksUri,
	BulkBlocks,
	BulkNames,
	BulkNamesInverse,
	BulkRanges,
	codepointInAnyRange,
	isUnicodeInverseMap,
	isUnicodeNameLookupMap,
	isUnicodeRangeMap,
	toTitleCase,
	UnicodeBulkCategory,
	UnicodeDataUri,
	UnicodeNameCategory,
} from '../dependency/index.js'
import type { Quote, StringNode, StringOptions } from '../node/index.js'
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
 * Returns true if `codepoint` is valid per UnicodeData.txt. The codepoint
 * is considered valid when:
 * - it lies within one of the `<…, First>`/`<…, Last>` contiguous ranges, OR
 * - it is explicitly listed in `UnicodeData.txt` (any entry - real names,
 *   legacy Unicode 1.0 aliases, or placeholder names like `<control>`).
 */
function isValidUnicodeCodepoint(codepoint: number, ctx: ParserContext): boolean {
	const inverse = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
		.getData(isUnicodeInverseMap)
	const ranges = ctx.symbols.query(BlocksUri, UnicodeBulkCategory, BulkRanges)
		.getData(isUnicodeRangeMap)
	if (!inverse || !ranges) {
		return false
	}
	if (codepointInAnyRange(codepoint, ranges)) {
		return true
	}
	return inverse[codepoint.toString(16)] !== undefined
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
		// If the hex-suffix function already emitted an error (e.g. out-of-
		// range), don't double-report. Fall back to name-only only when the
		// hex form was structurally invalid (unknown range name).
		if (ctx.err.dump().length > 0) {
			return undefined
		}
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
			ctx.err.report(
				localize('parser.string.hex-expected', rangeProbe[1]!),
				Range.create(src, src.getCharRange(rangeProbe[1]!.length - 1).end),
			)
			return undefined
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
				data.lowercase,
				start.toString(16).toUpperCase(),
				end.toString(16).toUpperCase(),
			),
			Range.create(src, src.getCharRange(hex.length - 1).end),
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
						ans.valueMap.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(cStart, src),
						})
						ans.value += EscapeTable.get(c2)
					} else if (
						options.escapable.unicode
						&& (c2 === 'u' || (options.escapable.extendedUnicode && UnicodeEscapeChar.is(c2)))
					) {
						const sequenceLength = UnicodeEscapeLengths.get(c2) ?? 4
						const hex = src.peek(sequenceLength)
						if (new RegExp(`^[0-9a-f]{${sequenceLength}}$`, 'i').test(hex)) {
							src.skip(sequenceLength)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += String.fromCharCode(parseInt(hex, 16))
						} else {
							ctx.err.report(
								localize('parser.string.illegal-unicode-escape'),
								Range.create(src, src.getCharRange(sequenceLength - 1).end),
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
								Range.create(src, src.getCharRange(name.length - 1).end),
							)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += c2
						} else {
							const codepoint = resolveNamedEscape(name, src, ctx)
							if (codepoint === undefined) {
								// Skip the generic error if a more specific one was
								// already emitted (e.g. "Hex codepoint expected after
								// hangul syllable").
								if (ctx.err.dump().length === 0) {
									ctx.err.report(
										localize('parser.string.illegal-unicode-escape-name'),
										Range.create(src, src.getCharRange(name.length - 1).end),
									)
								}
								ans.valueMap.push({
									inner: Range.create(ans.value.length, ans.value.length + 1),
									outer: Range.create(cStart, src),
								})
								ans.value += c2
							} else {
								src.skip(name.length + 1)
								ans.valueMap.push({
									inner: Range.create(ans.value.length, ans.value.length + 1),
									outer: Range.create(cStart, src),
								})
								ans.value += String.fromCodePoint(codepoint)
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
				ans.children = [valueResult]
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
