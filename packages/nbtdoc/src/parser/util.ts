import { AstNode, CommentNode, ErrorSeverity, Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source, Success } from '@spyglassmc/core'
import { comment } from '.'
import { Syntax } from '../node'

/**
 * @returns A parser that parses the gap between **SYNTAX** rules, which may contains whitespace and regular comments.
 */
export function syntaxGap(): InfallibleParser<CommentNode[]> {
	return (src: Source, ctx: ParserContext): CommentNode[] => {
		const ans: CommentNode[] = []

		src.skipWhitespace()

		while (src.canRead() && src.peek(2) === '//') {
			const result = comment()(src, ctx) as Success<CommentNode>
			ans.push(result)
			src.skipWhitespace()
		}

		return ans
	}
}

/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function syntax<CN extends AstNode>(parsers: InfallibleParser<CN | null>[]): InfallibleParser<Syntax<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | null>[]): Parser<Syntax<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | null>[]): Parser<Syntax<CN>> {
	return (src: Source, ctx: ParserContext): Result<Syntax<CN>> => {
		const ans: Syntax<CN> = {
			nodes: [],
			range: Range.create(src),
		}

		for (const parser of parsers) {
			ans.nodes.push(...syntaxGap()(src, ctx))

			const result = parser(src, ctx)
			if (result === Failure) {
				return Failure
			} else if (result === null) {
				// An optional parser yielded `null`.
				continue
			}

			ans.nodes.push(result)
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parser being repeated zero or more times.
 */
export function repeat<CN extends AstNode>(parser: Parser<CN>): InfallibleParser<Syntax<CN>> {
	return (src: Source, ctx: ParserContext): Syntax<CN> => {
		const ans: Syntax<CN> = {
			nodes: [],
			range: Range.create(src),
		}

		while (src.canRead()) {
			ans.nodes.push(...syntaxGap()(src, ctx))

			const { result, updateSrcAndCtx } = attempt(parser, src, ctx)

			if (result === Failure) {
				break
			}

			updateSrcAndCtx()
			ans.nodes.push(result)
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * Attempts to parse using the given `parser`.
 * @returns
 * - `result`: The result returned by the `parser`.
 * - `updateSrcAndCtx`: A function that will update the passed-in `src` and `ctx` to the state where `parser` has been executed.
 */
function attempt<N>(parser: Parser<N>, src: Source, ctx: ParserContext): {
	result: Result<N>,
	updateSrcAndCtx: () => void,
} {
	const tmpSrc = src.clone()
	const tmpCtx = ParserContext.create({
		...ctx,
		err: ctx.err.derive(),
	})

	const result = parser(tmpSrc, tmpCtx)

	return {
		result,
		updateSrcAndCtx: () => {
			src.cursor = tmpSrc.cursor
			ctx.err.absorb(tmpCtx.err)
		},
	}
}

/**
 * @returns A parser that outputs the result of the first passed-in non-failing parser.
 * 
 * `Failure` when all of the passed-in parsers failed.
 */
export function any<N extends {} = AstNode>(parsers: [...Parser<N>[], InfallibleParser<N>]): InfallibleParser<N>
export function any<N extends {} = AstNode>(parsers: Parser<N>[]): Parser<N>
export function any<N extends {} = AstNode>(parsers: Parser<N>[]): Parser<N> {
	return (src: Source, ctx: ParserContext): Result<N> => {
		for (const [i, parser] of parsers.entries()) {
			const { result, updateSrcAndCtx } = attempt(parser, src, ctx)
			if (result === Failure && i !== parsers.length - 1) {
				// This is still not the last parser.
				continue
			} else {
				updateSrcAndCtx()
				return result
			}
		}
		throw new Error('No parser was passed in.')
	}
}

/**
 * @returns A parser that takes an optional syntax component.
 */
export function optional<N extends {} = AstNode>(parser: Parser<N>): InfallibleParser<N | null> {
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

interface HavingRange {
	range: Range
}

/**
 * @returns The return value of `fn`. If it is an object and doesn't have the `range` property, 
 * it will be assigned the same `range` as the result of the `parser`.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function wrap<A extends HavingRange, B>(parser: InfallibleParser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): InfallibleParser<B extends object ? (B extends HavingRange ? B : B & HavingRange) : B>
export function wrap<A extends HavingRange, B>(parser: Parser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): Parser<B extends object ? (B extends HavingRange ? B : B & HavingRange) : B>
export function wrap<A extends HavingRange, B>(parser: Parser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): Parser<B extends object ? (B extends HavingRange ? B : B & HavingRange) : B> {
	return (src: Source, ctx: ParserContext) => {
		const result = parser(src, ctx)
		if (result === Failure) {
			return Failure
		}
		const ans = fn(result, src, ctx)
		if (typeof ans === 'object') {
			return Object.freeze({
				...ans,
				range: (ans as any).range ?? result.range,
			})
		}
		else {
			return Object.freeze(ans) as any
		}
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
	return wrap(
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
