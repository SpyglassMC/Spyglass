import { Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { KeywordToken } from '../node'

interface Options {
	literal: string,
	canBeFollowedByLetter: boolean,
}

function parse({ literal, canBeFollowedByLetter }: Options, src: Source, ctx: ParserContext): KeywordToken {
	src.skipWhitespace()
	const start = src.cursor
	const ans: KeywordToken = {
		type: `nbtdoc:keyword/${literal}`,
		range: Range.create(start),
		text: '',
	}

	if (src.peek(literal.length) === literal) {
		src.skip(literal.length)
		ans.text = literal
		if (!canBeFollowedByLetter && /^[a-z]$/.test(src.peek())) {
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
				localize('punc.quote', [literal]),
			]),
			ans.range
		)
	}

	ans.range = Range.create(start, src.cursor)
	return ans

}

export namespace KeywordParser {
	export function create(options: Partial<Options>): Parser<KeywordToken> {
		return parse.bind(undefined, {
			literal: options.literal ?? '',
			canBeFollowedByLetter: !!options?.canBeFollowedByLetter,
		})
	}
}
