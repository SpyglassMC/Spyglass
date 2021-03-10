import type { InfallibleParser, ParserContext, Source } from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { StringToken } from '../../node'

const EscapeChars = ['"', '\\', 'b', 'f', 'n', 'r', 't'] as const
type EscapeChar = typeof EscapeChars[number]

function isEscapeChar(c: string): c is EscapeChar {
	return EscapeChars.includes(c as any)
}

const EscapeTable = new Map<EscapeChar, string>([
	['"', '"'],
	['\\', '\\'],
	['b', '\b'],
	['f', '\f'],
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
])

// TODO: rewrite using combinators.
export function string(): InfallibleParser<StringToken> {
	return (src: Source, ctx: ParserContext): StringToken => {
		const ans: StringToken = {
			type: 'nbtdoc:string',
			range: Range.create(src),
			value: '',
		}

		if (src.peek() === '"') {
			src.skip()
			while (src.canRead() && /^[^"\b\f\n\r\t]$/.test(src.peek())) {
				const c = src.peek()
				src.skip()
				if (c === '\\') {
					const c2 = src.peek()
					if (isEscapeChar(c2)) {
						src.skip()
						ans.value += EscapeTable.get(c2)
					} else {
						ctx.err.report(localize('unknown-escape', [
							localeQuote(c2),
						]), Range.create(src, src.cursor + 1))
						break
					}
				} else {
					ans.value += c
				}
			}
			if (src.peek() === '"') {
				src.skip()
			} else {
				ctx.err.report(localize('expected', [
					localeQuote('"'),
				]), src)
			}
		} else {
			ctx.err.report(localize('expected', [
				localize('nbtdoc.parser.string', [localeQuote('"')]),
			]), src)
		}

		ans.range.end = src.cursor

		return ans
	}
}
