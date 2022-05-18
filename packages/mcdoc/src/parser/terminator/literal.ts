import type { InfallibleParser, Parser, ParserContext, Result, Source } from '@spyglassmc/core'
import { Failure, Range } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { LiteralToken } from '../../node'


/**
 * `Failure` when there isn't the expected literal and `infallible` is set to `false`.
 */
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: true): InfallibleParser<LiteralToken>
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: false): Parser<LiteralToken>
function _literal(literal: string, canBeFollowedByLetter: boolean, infallible: boolean): Parser<LiteralToken> {
	return (src: Source, ctx: ParserContext): Result<LiteralToken> => {
		const ans: LiteralToken = {
			type: 'mcdoc:literal',
			range: Range.create(src),
			value: '',
		}

		const fullMatch = src.trySkip(literal)

		ans.range.end = src.cursor

		if (fullMatch) {
			ans.value = literal
			if (!canBeFollowedByLetter && /^[A-Za-z0-9_]$/.test(src.peek())) {
				ctx.err.report(
					localize('expected', localize('mcdoc.parser.keyword.separation')),
					src
				)
			}
		} else if (infallible) {
			ctx.err.report(
				localize('expected', localeQuote(literal)),
				ans
			)
		} else {
			return Failure
		}

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
