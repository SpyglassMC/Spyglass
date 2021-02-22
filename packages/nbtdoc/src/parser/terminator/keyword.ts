import { Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { KeywordToken, PunctuationToken, wrap } from '../..'

interface Options {
	canBeFollowedByLetter?: boolean,
	infallible?: boolean,
}

/**
 * `Failure` when there isn't the expected keyword and `infallible` is set to false (default).
 */
export function keyword(literal: string, { canBeFollowedByLetter, infallible }: Options = {}): Parser<KeywordToken> {
	return (src: Source, ctx: ParserContext): Result<KeywordToken> => {
		const ans: KeywordToken = {
			type: 'nbtdoc:keyword',
			range: Range.create(src),
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
					Range.create(src)
				)
			}
		} else if (infallible) {
			ctx.err.report(
				localize('expected', [
					localize('punc.quote', [literal]),
				]),
				ans.range
			)
		} else {
			return Failure
		}

		ans.range.end = src.cursor

		return ans
	}
}

export function punctuation(char: string): InfallibleParser<PunctuationToken> {
	return wrap(
		keyword(char, { canBeFollowedByLetter: true, infallible: true }) as InfallibleParser<KeywordToken>,
		res => ({
			type: 'nbtdoc:punctuation',
			text: res.text,
		})
	)
}
