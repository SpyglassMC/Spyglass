import { Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { LiteralToken } from '../..'

interface Options {
	canBeFollowedByLetter?: boolean,
	infallible?: boolean,
}

/**
 * `Failure` when there isn't the expected literal and `infallible` is set to `false`.
 */
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: true): InfallibleParser<LiteralToken>
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: false): Parser<LiteralToken>
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: boolean): Parser<LiteralToken> {
	return (src: Source, ctx: ParserContext): Result<LiteralToken> => {
		const ans: LiteralToken = {
			type: 'nbtdoc:literal',
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
					src
				)
			}
		} else if (infallible) {
			ctx.err.report(
				localize('expected', [
					localize('punc.quote', [literal]),
				]),
				ans
			)
		} else {
			return Failure
		}

		ans.range.end = src.cursor

		return ans
	}
}

export function literal(literal: string): InfallibleParser<LiteralToken> {
	return _literal(literal, false, true)
}

/**
 * `Failure` when there isn't the expected character.
 */
export function keyword(keyword: string): Parser<LiteralToken> {
	return _literal(keyword, false, false)
}

export function punctuation(char: string): InfallibleParser<LiteralToken> {
	return _literal(char, true, true)
}

/**
 * `Failure` when there isn't the expected character.
 */
export function marker(char: string): Parser<LiteralToken> {
	return _literal(char, true, false)
}
