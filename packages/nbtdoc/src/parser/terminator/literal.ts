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

export function literal<T extends string = string>(literal: T): InfallibleParser<LiteralToken<T | ''>> {
	return _literal(literal, false, true) as InfallibleParser<LiteralToken<T | ''>>
}

/**
 * `Failure` when there isn't the expected character.
 */
export function keyword<T extends string = string>(keyword: T): Parser<LiteralToken<T>> {
	return _literal(keyword, false, false) as Parser<LiteralToken<T>>
}

export function punctuation<T extends string = string>(char: T): InfallibleParser<LiteralToken<T | ''>> {
	return _literal(char, true, true) as InfallibleParser<LiteralToken<T | ''>>
}

/**
 * `Failure` when there isn't the expected character.
 */
export function marker<T extends string = string>(char: T): Parser<LiteralToken<T>> {
	return _literal(char, true, false) as Parser<LiteralToken<T>>
}
