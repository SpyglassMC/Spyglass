import { Failure, InfallibleParser, Parser, ParserContext, Result } from '.'
import { AstNode, ErrorSeverity, Range, Returnable, SequenceUtil, Source } from '..'
import { ErrorReporter } from '../util'

export type AttemptResult<N extends Returnable = AstNode> = {
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
export function attempt<N extends Returnable = AstNode>(parser: Parser<N>, src: Source, ctx: ParserContext): AttemptResult<N> {
	const tmpSrc = src.clone()
	const tmpCtx = ParserContext.create({
		...ctx,
		err: new ErrorReporter(),
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
 * @template CN Child node.
 * 
 * @param parseGap A parser that parses gaps between nodes in the sequence.
 * 
 * @returns A parser that takes a sequence built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function sequence<CN extends AstNode>(parsers: InfallibleParser<CN | SequenceUtil<CN> | null>[], parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>>
export function sequence<CN extends AstNode>(parsers: Parser<CN | SequenceUtil<CN> | null>[], parseGap?: InfallibleParser<CN[]>): Parser<SequenceUtil<CN>>
export function sequence<CN extends AstNode>(parsers: Parser<CN | SequenceUtil<CN> | null>[], parseGap?: InfallibleParser<CN[]>): Parser<SequenceUtil<CN>> {
	return (src: Source, ctx: ParserContext): Result<SequenceUtil<CN>> => {
		const ans: SequenceUtil<CN> = {
			isSequenceUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		for (const parser of parsers) {
			if (parseGap) {
				ans.nodes.push(...parseGap(src, ctx))
			}

			const result = parser(src, ctx)
			if (result === Failure) {
				return Failure
			} else if (result === null) {
				continue
			} else if (SequenceUtil.is(result)) {
				ans.nodes.push(...result.nodes)
			} else {
				ans.nodes.push(result)
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * @template CN Child node.
 * 
 * @param parser Must be fallible, as an infallible parser being repeated will result in an infinite loop.
 * @param parseGap A parser that parses gaps between nodes in the sequence.
 * 
 * @returns A parser that takes a sequence with the passed-in parser being repeated zero or more times.
 */
export function repeat<CN extends AstNode>(parser: InfallibleParser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): void
export function repeat<CN extends AstNode>(parser: Parser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>>
export function repeat<CN extends AstNode>(parser: Parser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>> {
	return (src: Source, ctx: ParserContext): SequenceUtil<CN> => {
		const ans: SequenceUtil<CN> = {
			isSequenceUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		while (src.canRead()) {
			if (parseGap) {
				ans.nodes.push(...parseGap(src, ctx))
			}

			const { result, updateSrcAndCtx } = attempt(parser, src, ctx)

			if (result === Failure) {
				break
			}

			updateSrcAndCtx()
			if (SequenceUtil.is(result)) {
				ans.nodes.push(...result.nodes)
			} else {
				ans.nodes.push(result)
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * @returns A parser that returns the result of the passed-in parser which produces the least amount of error.
 * If there are more than one `parsers` produced the same amount of errors, it then takes the parser that went the furthest in `Source`.
 * If there is still a tie, it takes the one closer to the beginning of the `parsers` array.
 * 
 * `Failure` when all of the `parsers` failed.
 */
export function any<N extends Returnable>(parsers: [...Parser<N>[], InfallibleParser<N>]): InfallibleParser<N>
export function any<N extends Returnable>(parsers: Parser<N>[]): Parser<N>
export function any<N extends Returnable>(parsers: Parser<N>[]): Parser<N> {
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
 * @returns A parser that takes an optional syntax component.
 */
export function optional<N extends Returnable>(parser: InfallibleParser<N>): void
export function optional<N extends Returnable>(parser: Parser<N>): InfallibleParser<N | null>
export function optional<N extends Returnable>(parser: Parser<N>): InfallibleParser<N | null> {
	// return any<N | null>([
	// 	parser,
	// 	empty,
	// ])
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
 * @param parser Must be fallible.
 * 
 * @returns A parser that returns the return value of the `parser`, or the return value of `defaultValue` it it's a `Failure`.
 */
export function recover<N extends Returnable>(parser: InfallibleParser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): void
export function recover<N extends Returnable>(parser: Parser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): InfallibleParser<N>
export function recover<N extends Returnable>(parser: Parser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): InfallibleParser<N> {
	return (src: Source, ctx: ParserContext): N => {
		const result = parser(src, ctx)
		if (result === Failure) {
			const ans = defaultValue(src, ctx)
			return ans
		}
		return result
	}
}

/**
 * @returns A parser that returns the return value of `fn`.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function map<NA extends Returnable, NB extends Returnable>(parser: InfallibleParser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): InfallibleParser<NB>
export function map<NA extends Returnable, NB extends Returnable>(parser: Parser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): Parser<NB>
export function map<NA extends Returnable, NB extends Returnable>(parser: Parser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): Parser<NB> {
	return (src: Source, ctx: ParserContext): Result<NB> => {
		const result = parser(src, ctx)
		if (result === Failure) {
			return Failure
		}
		const ans = fn(result, src, ctx)
		return ans
	}
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
