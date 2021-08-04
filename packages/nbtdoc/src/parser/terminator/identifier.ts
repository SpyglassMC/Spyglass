import type { InfallibleParser, ParserContext, Source } from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { IdentifierToken } from '../../node'

interface Options {
	regex?: RegExp,
	allowEmpty?: boolean,
}

const Regex = /^[A-Za-z_][A-Za-z0-9_]*$/
const HardSeparations = new Set([
	'\r', '\n', ' ', ';', ':', '@', '/', ',', '{', '}', '[', ']', '(', ')', '.', '=', '?',
])

export function identifier({ regex = Regex, allowEmpty = false }: Options = {}): InfallibleParser<IdentifierToken> {
	return (src: Source, ctx: ParserContext): IdentifierToken => {
		const start = src.cursor
		const text = src.readUntil(...HardSeparations)
		const ans: IdentifierToken = {
			type: 'nbtdoc:identifier',
			range: Range.create(start, src),
			value: text,
		}

		if (!text && !allowEmpty) {
			ctx.err.report(
				localize('expected', localize('nbtdoc.parser.identifier')),
				ans
			)
		} else if (!text.match(regex)) {
			ctx.err.report(
				localize('nbtdoc.parser.identifier.illegal',
					localeQuote(text),
					localeQuote(regex.toString())
				),
				ans
			)
		}

		return ans
	}
}
