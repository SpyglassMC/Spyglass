import { Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source, wrap } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { KeywordToken, PunctuationToken } from '../..'

interface Options {
	canBeFollowedByLetter?: boolean,
	infallible?: boolean,
}

/**
 * `Failure` when there isn't the expected keyword and `infallible` is set to `false` (default).
 */
export function keyword(literal: string, options: Options & { infallible: true }): InfallibleParser<KeywordToken>
export function keyword(literal: string, options?: Options): Parser<KeywordToken>
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
			if (!canBeFollowedByLetter && /^[A-Za-z0-9_]$/.test(src.peek())) {
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

/**
 * `Failure` when there isn't the expected character and `fail` is set to `true` (defaults to `false`).
 */
export function punctuation(char: string, fail: true): Parser<PunctuationToken>
export function punctuation(char: string): InfallibleParser<PunctuationToken>
export function punctuation(char: string, fail?: true): Parser<PunctuationToken> {
	return wrap(
		keyword(char, { canBeFollowedByLetter: true, infallible: !fail }),
		res => ({
			type: 'nbtdoc:punctuation',
			text: res.text,
		})
	)
}
