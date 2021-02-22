import { Failure, InfallibleParser, Parser, ParserContext, Result } from '.'
import { AstNode, ErrorSeverity, Range, Source } from '..'

type AttemptResult<N extends object = AstNode> = {
	result: Result<N>,
	updateSrcAndCtx: () => void,
	endCursor: number,
	errorAmount: number,
}

/**
 * Attempts to parse using the given `parser`.
 * @returns
 * - `result`: The result returned by the `parser`.
 * - `updateSrcAndCtx`: A function that will update the passed-in `src` and `ctx` to the state where `parser` has been executed.
 */
export function attempt<N extends object = AstNode>(parser: Parser<N>, src: Source, ctx: ParserContext): AttemptResult<N> {
	const tmpSrc = src.clone()
	const tmpCtx = ParserContext.create({
		...ctx,
		err: ctx.err.derive(),
	})

	const result = parser(tmpSrc, tmpCtx)

	return {
		result,
		endCursor: tmpSrc.cursor,
		errorAmount: tmpCtx.err.errors.length,
		updateSrcAndCtx: () => {
			src.cursor = tmpSrc.cursor
			ctx.err.absorb(tmpCtx.err)
		},
	}
}

/**
 * @returns A parser that returns the result of the passed-in parser which produces the least amount of error.
 * If there are more than one `parsers` produced the same amount of errors, it then takes the parser that went the furthest in `Source`.
 * If there is still a tie, it takes the one closer to the beginning of the `parsers` array.
 * 
 * `Failure` when all of the `parsers` failed.
 */
export function any<N extends object = AstNode>(parsers: [...Parser<N>[], InfallibleParser<N>]): InfallibleParser<N>
export function any<N extends object = AstNode>(parsers: [Parser<N>, ...Parser<N>[]]): Parser<N>
export function any<N extends object = AstNode>(parsers: Parser<N>[]): Parser<N> {
	return (src: Source, ctx: ParserContext): Result<N> => {
		const attempts: AttemptResult<N>[] = parsers
			.map(parser => attempt(parser, src, ctx))
			.filter(att => att.result !== Failure)
			.sort((a, b) => (a.errorAmount - b.errorAmount) || (b.endCursor - a.endCursor))
		if (attempts.length === 0) {
			return Failure
		}
		attempts[0].updateSrcAndCtx()
		return attempts[0].result
	}
}

/**
 * @param parser Must be fallible.
 * 
 * @returns A parser that takes an optional syntax component.
 */
export function optional<N extends object = AstNode>(parser: InfallibleParser<N>): void
export function optional<N extends object = AstNode>(parser: Parser<N>): InfallibleParser<N | null>
export function optional<N extends object = AstNode>(parser: Parser<N>): InfallibleParser<N | null> {
	return (src: Source, ctx: ParserContext): N | null => {
		const { result, updateSrcAndCtx } = attempt(parser, src, ctx)
		if (result === Failure) {
			return null
		} else {
			updateSrcAndCtx()
			return result
		}
	}
}

/**
 * @returns The return value of `fn`.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function map<A, B>(parser: InfallibleParser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): InfallibleParser<B>
export function map<A, B>(parser: Parser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): Parser<B>
export function map<A, B>(parser: Parser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): Parser<B> {
	return (src: Source, ctx: ParserContext): Result<B> => {
		const result = parser(src, ctx)
		if (result === Failure) {
			return Failure
		}
		const ans = fn(result, src, ctx)
		return Object.freeze(ans)
	}
}

interface HavingRange {
	range: Range
}
type ResultB<B> = B extends HavingRange ? B : B & HavingRange

/**
 * @returns The return value of `fn`. If it doesn't have the `range` property, 
 * it will be assigned the same `range` as the result of the `parser`.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function wrap<A extends HavingRange, B extends object>(parser: InfallibleParser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): InfallibleParser<ResultB<B>>
export function wrap<A extends HavingRange, B extends object>(parser: Parser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): Parser<ResultB<B>>
export function wrap<A extends HavingRange, B extends object>(parser: Parser<A>, fn: (res: A, src: Source, ctx: ParserContext) => B): Parser<ResultB<B>> {
	return map(
		parser,
		(res, src, ctx) => {
			const ans = fn(res, src, ctx)
			return Object.freeze({
				...ans,
				range: (ans as HavingRange).range ?? res.range,
			}) as ResultB<B>
		}
	)
}

/**
 * Checks if the result of `parser` is valid, and reports an error if it's not.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function validate<N extends AstNode>(parser: InfallibleParser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): InfallibleParser<N>
export function validate<N extends AstNode>(parser: Parser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): Parser<N>
export function validate<N extends AstNode>(parser: Parser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): Parser<N> {
	return map(
		parser,
		(res, src, ctx) => {
			const isLegal = validator(res, src, ctx)
			if (!isLegal) {
				ctx.err.report(message, res.range, severity)
			}
			return res
		}
	)
}
