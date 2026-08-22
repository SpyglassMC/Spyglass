import { localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type {
	AstNode,
	Quote,
	StringNode,
	StringOptions,
	UnicodeEscapeKind,
	UnicodeEscapeNode,
} from '../node/index.js'
import { EscapeChar, EscapeTable, UnicodeEscapeLengths } from '../node/index.js'
import type { InfallibleParser } from '../parser/index.js'
import type { ParserContext } from '../service/index.js'
import type { IndexMap } from '../source/index.js'
import { Range, Source } from '../source/index.js'
import type { Parser, Result, Returnable } from './Parser.js'
import { Failure } from './Parser.js'

function makeEscapeChild(
	start: number,
	end: number,
	raw: string,
	kind: UnicodeEscapeKind,
	resolved = '',
): UnicodeEscapeNode {
	return {
		type: 'unicode_escape',
		kind,
		range: Range.create(start, end),
		raw,
		resolved,
		codepoint: resolved ? resolved.codePointAt(0)! : 0,
	}
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
		const pushChild = (node: AstNode) => (ans.children ??= []).push(node)
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
						pushChild(
							makeEscapeChild(cStart, src.cursor, c2, c2 as UnicodeEscapeKind, resolved),
						)
					} else if (
						c2 === 'u' || c2 === 'U' || c2 === 'x'
					) {
						const sequenceLength = UnicodeEscapeLengths.get(c2) ?? 4
						const hex = src.peek(sequenceLength)
						if (new RegExp(`^[0-9a-f]{${sequenceLength}}$`, 'i').test(hex)) {
							src.skip(sequenceLength)
							const raw = src.sliceToCursor(cStart)
							const codepoint = parseInt(hex, 16)
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
							const resolved = String.fromCodePoint(codepoint)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += resolved
							pushChild(
								makeEscapeChild(cStart, src.cursor, raw, c2),
							)
						} else {
							const closingQuote = src.string.indexOf(currentQuote, src.innerCursor)
							const charsLeft = closingQuote === -1
								? src.string.length - src.innerCursor
								: closingQuote - src.innerCursor
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
					} else if (c2 === 'N') {
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
								Range.create(cStart, src),
							)
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(cStart, src),
							})
							ans.value += c2
						} else {
							src.skip(name.length + 1)
							const raw = src.sliceToCursor(cStart)
							pushChild(makeEscapeChild(cStart, src.cursor, raw, 'N'))
							ans.valueMap.push({
								inner: Range.create(ans.value.length, ans.value.length + raw.length),
								outer: Range.create(cStart, src),
							})
							ans.value += raw
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
				pushChild(valueResult)
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
