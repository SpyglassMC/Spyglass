import type { AstNode, CommentNode, InfallibleParser, Parser, ParserContext, Source } from '@spyglassmc/core'
import { repeat, sequence } from '@spyglassmc/core'
import type { SyntaxUtil } from '../node'
import { comment } from './terminator'

// TODO: Move this whole file to `@spyglassmc/core`.

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

type SP<CN extends AstNode> = Parser<CN | SyntaxUtil<CN> | null>
type SIP<CN extends AstNode> = InfallibleParser<CN | SyntaxUtil<CN> | null>
/**
 * @template CN Child node.
 * 
 * @returns A parser that follows a **SYNTAX** rule built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function syntax<CN extends AstNode>(parsers: SIP<CN>[], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN>>
export function syntax<CN1 extends AstNode>(parsers: [SIP<CN1>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1>>
export function syntax<CN1 extends AstNode>(parsers: [SIP<CN1>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>, SIP<CN9>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode, CN10 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>, SIP<CN9>, SIP<CN10>], forbidsDocCommentsInGap?: boolean): InfallibleParser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9 | CN10>>
export function syntax<CN extends AstNode>(parsers: SP<CN>[], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN>>
export function syntax<CN1 extends AstNode>(parsers: [SP<CN1>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode>(parsers: [SP<CN1>, SP<CN2>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>, SP<CN9>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9>>
export function syntax<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode, CN10 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>, SP<CN9>, SP<CN10>], forbidsDocCommentsInGap?: boolean): Parser<SyntaxUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9 | CN10>>
export function syntax<CN extends AstNode>(parsers: SP<CN>[], forbidsDocCommentsInGap = false): Parser<SyntaxUtil<CN>> {
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
