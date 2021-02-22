import * as core from '@spyglassmc/core'
import { CommentNode, Parser } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { validate } from '..'

/**
 * @returns A comment parser that accepts normal comments (`//`) and reports an error if it's a doc comment (`///`).
 * 
 * `Failure` when three isn't a comment.
 */
export function comment(): Parser<CommentNode> {
	return validate(
		core.comment({
			singleLinePrefixes: new Set(['//']),
		}),
		res => !res.comment.startsWith('///'),
		localize('nbtdoc.error.syntax.doc-comment-unexpected')
	)
}
