import type { InfallibleParser } from '@spyglassmc/core'
import { CommentNode, map } from '@spyglassmc/core'
import type { DocCommentsNode } from '../../node'
import { docComment } from '../terminator'
import { syntaxRepeat } from '../util'

/**
 * @returns A parser that takes zero or more doc comments.
 */
export const docComments: InfallibleParser<DocCommentsNode> = map(
	syntaxRepeat<CommentNode>(docComment, true),
	res => {
		const ans: DocCommentsNode = {
			type: 'mcdoc:doc_comments',
			range: res.range,
			children: res.children,
			value: res.children.filter(CommentNode.is).map(v => v.comment).join(''),
		}
		return ans
	}
)
