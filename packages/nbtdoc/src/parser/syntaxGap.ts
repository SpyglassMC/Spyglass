import { CommentNode, InfallibleParser, ParserContext, Source, Success } from '@spyglassmc/core'
import { comment } from '.'

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
