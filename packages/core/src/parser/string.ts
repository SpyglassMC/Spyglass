import { localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { Mutable, Quote, StringNode, StringOptions } from '../node'
import { EscapeChar, EscapeTable } from '../node'
import type { InfallibleParser } from '../parser'
import { ErrorReporter, ParserContext } from '../service'
import { IndexMap, Range, Source } from '../source'
import type { Parser, Result, Returnable } from './Parser'
import { Failure } from './Parser'

export function string(options: StringOptions): InfallibleParser<StringNode> {
	return (src: Source, ctx: ParserContext): StringNode => {
		const start = src.cursor
		const ans: Mutable<StringNode> = {
			type: 'string',
			range: Range.create(src),
			options,
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
					if (c2 === '\\' || c2 === currentQuote || EscapeChar.is(options.escapable.characters, c2)) {
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
							ctx.err.report(
								localize('parser.string.illegal-escape', localeQuote(c2)),
								Range.create(src, src.cursor + 1)
							)
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
			if (!src.trySkip(currentQuote)) {
				ctx.err.report(localize('expected', localeQuote(currentQuote)), src)
			}

			if (!options.quotes.includes(currentQuote)) {
				ctx.err.report(localize('parser.string.illegal-quote', options.quotes), ans)
			}

			ans.valueMap.outerRange = Range.create(contentStart, contentEnd)
		} else if (options.unquotable) {
			while (src.canRead() && options.unquotable.test(ans.value + src.peek())) {
				ans.value += src.read()
			}
			if (!ans.value && !options.unquotable.test(ans.value)) {
				ctx.err.report(localize('expected', localize('string')), src)
			}
			ans.valueMap.outerRange = Range.create(start, src.cursor)
		} else {
			ctx.err.report(localize('expected', options.quotes!), src)
			ans.valueMap.outerRange = Range.create(start, src.cursor)
		}

		ans.valueMap.innerRange = Range.create(0, ans.value.length)

		if (options.value?.parser) {
			const valueResult = parseStringValue(options.value.parser, ans.value, ans.valueMap, ctx)
			/* istanbul ignore else */
			if (valueResult !== Failure) {
				ans.valueNode = valueResult
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

export function parseStringValue<T extends Returnable>(parser: Parser<T>, value: string, map: IndexMap, ctx: ParserContext): Result<T> {
	const valueSrc = new Source(value)
	const valueCtx = ParserContext.create({
		...ctx,
		doc: TextDocument.create('spyglassmc://inner_string', 'plaintext', 0, value),
		err: new ErrorReporter(),
	})
	const valueResult = parser(valueSrc, valueCtx)
	/* istanbul ignore else */
	if (valueResult !== Failure) {
		ctx.err.absorb(valueCtx.err, { map, doc: ctx.doc })
	}
	// TODO: Mark trailing string as errors.
	return valueResult
}

export const BrigadierUnquotablePattern = /^[0-9A-Za-z_\.\+\-]*$/

export const BrigadierStringOptions: StringOptions = {
	escapable: {},
	quotes: ['"', "'"],
	unquotable: BrigadierUnquotablePattern,
}

export const brigadierString = string(BrigadierStringOptions)
