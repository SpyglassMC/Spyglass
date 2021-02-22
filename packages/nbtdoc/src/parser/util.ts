import { AstNode, ErrorSeverity, Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source } from '@spyglassmc/core'
import { SyntaxNode } from '../node'
import { syntaxGap } from './syntaxGap'

/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function syntax<CN extends AstNode>(parsers: InfallibleParser<CN>[]): InfallibleParser<SyntaxNode<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN>[]): Parser<SyntaxNode<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN>[]): Parser<SyntaxNode<CN>> {
	return (src: Source, ctx: ParserContext): Result<SyntaxNode<CN>> => {
		const ans: SyntaxNode<CN> = {
			nodes: [],
			range: Range.create(src),
		}

		for (const parser of parsers) {
			ans.nodes.push(...syntaxGap()(src, ctx))

			const result = parser(src, ctx)
			if (result === Failure) {
				return Failure
			}

			ans.nodes.push(result)
		}

		ans.range.end = src.cursor

		return ans
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
			const tmpSrc = src.clone()
			const tmpErr = ctx.err.derive()
			const tmpCtx = ParserContext.create({
				...ctx,
				err: tmpErr,
			})

			const result = parser(tmpSrc, tmpCtx)

			if (result === Failure && i !== parsers.length - 1) {
				// This is still not the last parser.
				continue
			} else {
				src.cursor = tmpSrc.cursor
				ctx.err.absorb(tmpErr)
				return result
			}
		}
		throw new Error('No parser was passed in.')
	}
}

interface HavingRange {
	range: Range
}

/**
 * `Failure` when the `parser` returns a `Failure`.
 */
export function wrap<A extends HavingRange, B>(parser: InfallibleParser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): InfallibleParser<B & HavingRange>
export function wrap<A extends HavingRange, B>(parser: Parser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): Parser<B & HavingRange>
export function wrap<A extends HavingRange, B>(parser: Parser<A>, fn: (result: A, src: Source, ctx: ParserContext) => B): Parser<B & HavingRange> {
	return (src: Source, ctx: ParserContext) => {
		const result = parser(src, ctx)
		if (result === Failure) {
			return Failure
		}
		const ans = fn(result, src, ctx)
		return Object.freeze({
			...ans,
			range: (ans as any).range ?? result.range,
		})
	}
}

/**
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
