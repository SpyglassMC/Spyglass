import { Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { IdentifierToken } from '../../node'

export class IdentifierParser implements Parser<IdentifierToken> {
	private static readonly regex = /^[A-Za-z_][A-Za-z0-9_]*$/
	private static readonly hardSeparations = new Set([
		'\r', '\n', ' ', ';', ':', '@', '/', ',', '{', '}', '[', ']', '(', ')', '.', '=',
	])
	private static readonly reservedWords = new Set([
		'super',
		// TODO
	])

	parse(src: Source, ctx: ParserContext): IdentifierToken {
		src.skipWhitespace()
		const start = src.cursor
		const text = src.readUntilOrEnd(...IdentifierParser.hardSeparations)
		const ans: IdentifierToken = {
			type: 'nbtdoc:identifier',
			range: Range.create(start, src.cursor),
			text,
		}

		if (!text) {
			ctx.err.report(
				localize('expected', [
					localize('nbtdoc.error.identifier'),
				]),
				ans.range
			)
		} else if (!text.match(IdentifierParser.regex)) {
			ctx.err.report(
				localize('nbtdoc.error.identifier.illegal', [
					localize('punc.quote', [text]),
					localize('punc.quote', [IdentifierParser.regex.toString()]),
				]),
				ans.range
			)
		} else if (IdentifierParser.reservedWords.has(text)) {
			ctx.err.report(
				localize('nbtdoc.error.identifier.reserved', [
					localize('punc.quote', [text]),
				]),
				ans.range
			)
		}

		return ans
	}
}
