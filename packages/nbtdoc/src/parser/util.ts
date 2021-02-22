import { AstNode, CommentNode, ErrorSeverity, Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source, Success } from '@spyglassmc/core'
import { comment } from '.'
import { SyntaxUtil } from '../node'

// TODO: Move this whole file to `@spyglassmc/core`.

/**
 * @returns A parser that parses the gap between **SYNTAX** rules, which may contains whitespace and regular comments.
 */
export function syntaxGap(noDocCommentsInGap = false): InfallibleParser<CommentNode[]> {
	return (src: Source, ctx: ParserContext): CommentNode[] => {
		const ans: CommentNode[] = []

		src.skipWhitespace()

		while (src.canRead() && src.peek(2) === '//' && (!noDocCommentsInGap || src.peek(3) !== '///')) {
			const result = comment()(src, ctx) as Success<CommentNode>
			ans.push(result)
			src.skipWhitespace()
		}

		return ans
	}
}

// Temporary fix for https://github.com/microsoft/TypeScript/issues/17002.
// TODO(blocked): Remove this when unneeded.
declare global {
	interface ArrayConstructor {
		isArray(arg: readonly any[] | any): arg is readonly any[]
	}
}

/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function syntax<CN extends AstNode>(parsers: InfallibleParser<CN | SyntaxUtil<CN> | null>[]): InfallibleParser<SyntaxUtil<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | SyntaxUtil<CN> | null>[]): Parser<SyntaxUtil<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | SyntaxUtil<CN> | null>[]): Parser<SyntaxUtil<CN>> {
	return (src: Source, ctx: ParserContext): Result<SyntaxUtil<CN>> => {
		const ans: SyntaxUtil<CN> = {
			isSyntaxUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		for (const parser of parsers) {
			ans.nodes.push(...syntaxGap()(src, ctx))

			const result = parser(src, ctx)
			if (result === Failure) {
				return Failure
			} else if (result === null) {
				continue
			} else if (SyntaxUtil.is(result)) {
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
 * @param parser Must be fallible.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parser being repeated zero or more times.
 */
export function repeat<CN extends AstNode>(parser: InfallibleParser<CN | SyntaxUtil<CN>>, noDocCommentsInGap?: boolean): void
export function repeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, noDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
export function repeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, noDocCommentsInGap = false): InfallibleParser<SyntaxUtil<CN>> {
	return (src: Source, ctx: ParserContext): SyntaxUtil<CN> => {
		const ans: SyntaxUtil<CN> = {
			isSyntaxUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		while (src.canRead()) {
			ans.nodes.push(...syntaxGap(noDocCommentsInGap)(src, ctx))

			const { result, updateSrcAndCtx } = attempt(parser, src, ctx)

			if (result === Failure) {
				break
			}

			updateSrcAndCtx()
			if (SyntaxUtil.is(result)) {
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
export function any<N extends object = AstNode>(parsers: [...Parser<N>[], InfallibleParser<N>]): InfallibleParser<N>
export function any<N extends object = AstNode>(parsers: Parser<N>[]): Parser<N>
export function any<N extends object = AstNode>(parsers: Parser<N>[]): Parser<N> {
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
