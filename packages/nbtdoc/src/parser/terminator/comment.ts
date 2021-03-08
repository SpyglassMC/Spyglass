import type { CommentNode, Parser } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { validate } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'

/**
 * @returns A comment parser that accepts normal comments (`//`) and reports an error if it's a doc comment (`///`).
 * 
 * `Failure` when there isn't a comment.
 */
export function comment(): Parser<CommentNode> {
	return validate(
		core.comment({
			singleLinePrefixes: new Set(['//']),
		}),
		(res, src) => !src.slice(res).startsWith('///'),
		localize('nbtdoc.parser.syntax.doc-comment-unexpected')
	)
}
