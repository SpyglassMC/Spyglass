import { AstNode, attempt, CommentNode, Failure, InfallibleParser, Parser, ParserContext, Range, Result, Source, Success } from '@spyglassmc/core'
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
