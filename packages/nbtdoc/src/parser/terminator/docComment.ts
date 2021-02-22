import { comment, CommentNode, Parser } from '@spyglassmc/core'

/**
 * @returns A comment parser that accepts doc comments (`///`).
 * 
 * `Failure` when there isn't a doc comment.
 */
export function docComment(): Parser<CommentNode> {
	return comment({
		singleLinePrefixes: new Set(['///']),
		includesEol: true,
	})
}
