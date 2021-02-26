import { AstNode, CommentNode, InfallibleParser, Parser, ParserContext, repeat, sequence, Source } from '@spyglassmc/core'
import { comment } from '.'
import { SyntaxUtil } from '..'

// TODO: Move this whole file to `@spyglassmc/core`.

/**
 * @returns A parser that parses the gap between **SYNTAX** rules, which may contains whitespace and regular comments.
 */
export function syntaxGap(forbidsDocCommentsInGap = false): InfallibleParser<CommentNode[]> {
	return (src: Source, ctx: ParserContext): CommentNode[] => {
		const ans: CommentNode[] = []

		src.skipWhitespace()

		while (src.canRead() && src.peek(2) === '//' && (!forbidsDocCommentsInGap || src.peek(3) !== '///')) {
			const result = comment()(src, ctx) as CommentNode
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
export function syntax<CN extends AstNode>(parsers: InfallibleParser<CN | SyntaxUtil<CN> | null>[], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | SyntaxUtil<CN> | null>[], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN>>
export function syntax<CN extends AstNode>(parsers: Parser<CN | SyntaxUtil<CN> | null>[], forbidsDocCommentsInGap = false): Parser<SyntaxUtil<CN>> {
	return sequence<CN | CommentNode>(parsers, syntaxGap(forbidsDocCommentsInGap))
}

/**
 * @template CN Child node.
 * 
 * @param parser Must be fallible.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parser being repeated zero or more times.
 */
export function syntaxRepeat<CN extends AstNode>(parser: InfallibleParser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): void
export function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
export function syntaxRepeat<CN extends AstNode>(parser: Parser<CN | SyntaxUtil<CN>>, forbidsDocCommentsInGap = false): InfallibleParser<SyntaxUtil<CN>> {
	return repeat<CN | CommentNode>(parser, syntaxGap(forbidsDocCommentsInGap))
}
