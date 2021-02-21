import { Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { KeywordToken } from '../../node'

export class KeywordParser implements Parser<KeywordToken> {
	constructor(
		private readonly literal: string,
		private readonly canBeFollowedByLetter = false
	) { }

	parse(src: Source, ctx: ParserContext): KeywordToken {
		src.skipWhitespace()
		const start = src.cursor
		const ans: KeywordToken = {
			type: 'nbtdoc:keyword',
			range: Range.create(start),
			text: '',
		}

		if (src.peek(this.literal.length) === this.literal) {
			src.skip(this.literal.length)
			ans.text = this.literal
			if (!this.canBeFollowedByLetter && /^[a-z]$/.test(src.peek())) {
				ctx.err.report(
					localize('expected', [
						localize('nbtdoc.error.keyword.separation'),
					]),
					Range.create(src.cursor)
				)
			}
		} else {
			ctx.err.report(
				localize('expected', [
					localize('punc.quote', [this.literal]),
				]),
				ans.range
			)
		}

		ans.range = Range.create(start, src.cursor)
		return ans
	}
}
