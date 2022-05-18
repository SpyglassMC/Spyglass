import type { AstNode, CommentNode, InfallibleParser, Parser, ParserContext, Source } from '@spyglassmc/core'
import { repeat, sequence } from '@spyglassmc/core'
import type { SyntaxUtil } from '../node'
import { comment } from './terminator'

/**
 * @returns A parser that parses the gap between **SYNTAX** rules, which may contains whitespace and regular comments.
 */
export function syntaxGap(
	/* istanbul ignore next */
	forbidsDocCommentsInGap = false
): InfallibleParser<CommentNode[]> {
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

type SP<CN extends AstNode> = SIP<CN> | Parser<CN | SyntaxUtil<CN> | undefined> | { get: (result: SyntaxUtil<CN>) => Parser<CN | SyntaxUtil<CN> | undefined> }
type SIP<CN extends AstNode> = InfallibleParser<CN | SyntaxUtil<CN> | undefined> | { get: (result: SyntaxUtil<CN>) => InfallibleParser<CN | SyntaxUtil<CN> | undefined> }
/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function syntax<PA extends SIP<AstNode>[]>(parsers: PA, forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
export function syntax<PA extends SP<AstNode>[]>(parsers: PA, forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<{ [K in number]: PA[K] extends SP<infer V> ? V : never }[number]>>
export function syntax(parsers: SP<AstNode>[], forbidsDocCommentsInGap = false): Parser<SyntaxUtil<AstNode>> {
	return sequence(parsers, syntaxGap(forbidsDocCommentsInGap))
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
