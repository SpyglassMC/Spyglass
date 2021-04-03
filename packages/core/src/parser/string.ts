import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { Mutable, StringNode } from '../node'
import type { InfallibleParser } from '../parser'
import { ErrorReporter, ParserContext } from '../service'
import { IndexMap, Range, Source } from '../source'
import type { Parser } from './Parser'
import { Failure } from './Parser'

/** @internal Exported for test only. */
export interface Options {
	escapable?: {
		/**
		 * A list of characters that can be escaped. The current quote of the string and backslash (`\`)
		 * will be added to this list automatically.
		 */
		characters?: EscapeChar[],
		/**
		 * Whether escapes like `\u####` where #### is a hexdecimal numeral are allowed.
		 */
		unicode?: boolean,
		/**
		 * Whether unknown characters can be escaped, which would just result in the character itself.
		 */
		allowUnknown?: boolean,
	} | false,
	/**
	 * A list of characters that can serve as a quotation mark.
	 */
	quotes?: Quote[],
	/**
	 * Whether this string could be an unquoted string. If yes, specify the regex that the string has to satisfy.
	 * Otherwise set this to `false`.
	 */
	unquotable?: RegExp | false,
	/**
	 * An optional parser that will be used to parse the content of the string.
	 */
	valueParser?: Parser,
}

const EscapeChars = ['"', "'", '\\', 'b', 'f', 'n', 'r', 't'] as const
type EscapeChar = typeof EscapeChars[number]

export type Quote = "'" | '"'

function isEscapeChar(expected: EscapeChar[] | undefined, c: string): c is EscapeChar {
	return expected ? expected.includes(c as any) : false
}

const EscapeTable = new Map<EscapeChar, string>([
	['"', '"'],
	["'", "'"],
	['\\', '\\'],
	['b', '\b'],
	['f', '\f'],
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
])

export function string(options: Options): InfallibleParser<StringNode> {
	return (src: Source, ctx: ParserContext): StringNode => {
		const start = src.cursor
		const ans: Mutable<StringNode> = {
			type: 'string',
			range: Range.create(src),
			value: '',
			valueMap: IndexMap.create(),
		}

		if (options.quotes?.length && (src.peek() === '"' || src.peek() === "'")) {
			const currentQuote = src.read() as Quote
			const contentStart = src.cursor
			while (src.canRead() && !['\n', '\r', currentQuote].includes(src.peek())) {
				const charStart = src.cursor
				const c = src.read()
				if (options.escapable && c === '\\') {
					const c2 = src.read()
					if (c2 === '\\' || c2 === currentQuote || isEscapeChar(options.escapable.characters, c2)) {
						ans.valueMap.pairs.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(charStart, charStart + 2),
						})
						ans.value += EscapeTable.get(c2)
					} else if (options.escapable.unicode && c2 === 'u') {
						const hex = src.peek(4)
						if (/^[0-9a-f]{4}$/i.test(hex)) {
							src.skip(4)
							ans.valueMap.pairs.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(charStart, charStart + 6),
							})
							ans.value += String.fromCharCode(parseInt(hex, 16))
						} else {
							ctx.err.report(localize('parser.string.illegal-unicode-escape'), Range.create(src, src.cursor + 4))
							ans.valueMap.pairs.push({
								inner: Range.create(ans.value.length, ans.value.length + 1),
								outer: Range.create(charStart, charStart + 2),
							})
							ans.value += c2
						}
					} else {
						if (!options.escapable.allowUnknown) {
							ctx.err.report(localize('parser.string.illegal-escape', [
								localeQuote(c2),
							]), Range.create(src, src.cursor + 1))
						}
						ans.valueMap.pairs.push({
							inner: Range.create(ans.value.length, ans.value.length + 1),
							outer: Range.create(charStart, charStart + 2),
						})
						ans.value += c2
					}
				} else {
					ans.value += c
				}
			}

			const contentEnd = src.cursor
			if (src.peek() === currentQuote) {
				src.skip()
			} else {
				ctx.err.report(localize('expected', [localeQuote(currentQuote)]), src)
			}

			if (!options.quotes.includes(currentQuote)) {
				ctx.err.report(localize('parser.string.illegal-quote', [arrayToMessage(options.quotes)]), ans)
			}

			ans.valueMap.outerRange = Range.create(contentStart, contentEnd)
		} else if (options.unquotable) {
			while (src.canRead() && options.unquotable.test(ans.value + src.peek())) {
				ans.value += src.read()
			}
			if (!ans.value) {
				ctx.err.report(localize('expected', [localize('string')]), src)
			}
			ans.valueMap.outerRange = Range.create(start, src.cursor)
		} else {
			ctx.err.report(localize('expected', [arrayToMessage(options.quotes!)]), src)
			ans.valueMap.outerRange = Range.create(start, src.cursor)
		}

		ans.valueMap.innerRange = Range.create(0, ans.value.length)

		if (options.valueParser) {
			const valueSrc = new Source(ans.value)
			const valueCtx = ParserContext.create({
				...ctx,
				doc: TextDocument.create('spyglassmc://inner_string.txt', 'plaintext', 0, ans.value),
				err: new ErrorReporter(),
			})
			const valueResult = options.valueParser(valueSrc, valueCtx)
			ctx.err.absorb(valueCtx.err, { map: ans.valueMap, doc: ctx.doc })
			/* istanbul ignore else */
			if (valueResult !== Failure) {
				ans.valueNode = valueResult
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

export const BrigadierUnquotablePattern = /^[0-9A-Za-z_\.\+\-]+$/

export const brigadierString = string({
	escapable: {},
	quotes: ['"', '"'],
	unquotable: BrigadierUnquotablePattern,
})
