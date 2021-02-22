import { InfallibleParser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { IdentifierToken } from '../../node'

const Regex = /^[A-Za-z_][A-Za-z0-9_]*$/
const HardSeparations = new Set([
	'\r', '\n', ' ', ';', ':', '@', '/', ',', '{', '}', '[', ']', '(', ')', '.', '=',
])

export function identifier(): InfallibleParser<IdentifierToken> {
	return (src: Source, ctx: ParserContext): IdentifierToken => {
		src.skipWhitespace()
		const start = src.cursor
		const text = src.readUntilOrEnd(...HardSeparations)
		const ans: IdentifierToken = {
			type: 'nbtdoc:identifier',
			range: Range.create(start, src),
			text,
		}
	
		if (!text) {
			ctx.err.report(
				localize('expected', [
					localize('nbtdoc.error.identifier'),
				]),
				ans.range
			)
		} else if (!text.match(Regex)) {
			ctx.err.report(
				localize('nbtdoc.error.identifier.illegal', [
					localize('punc.quote', [text]),
					localize('punc.quote', [Regex.toString()]),
				]),
				ans.range
			)
		}
	
		return ans
	}
}
