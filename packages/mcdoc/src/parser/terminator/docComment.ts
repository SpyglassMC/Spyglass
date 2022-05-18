import type { CommentNode, Parser } from '@spyglassmc/core'
import { comment } from '@spyglassmc/core'

/**
 * @returns A comment parser that accepts doc comments (`///`).
 * 
 * `Failure` when there isn't a doc comment.
 */
export const docComment: Parser<CommentNode> = comment({
	singleLinePrefixes: new Set(['///']),
	includesEol: true,
})
