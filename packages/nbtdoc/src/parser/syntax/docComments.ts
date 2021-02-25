import { CommentNode, InfallibleParser, map } from '@spyglassmc/core'
import { DocCommentsNode } from '../../node'
import { docComment } from '../terminator'
import { syntaxRepeat } from '../util'

/**
 * @returns A parser that takes zero or more doc comments.
 */
export const docComments: InfallibleParser<DocCommentsNode> = map(
	syntaxRepeat<CommentNode>(docComment, true),
	res => {
		const ans: DocCommentsNode = {
			type: 'nbtdoc:doc_comments',
			range: res.range,
			children: res.nodes,
			doc: res.nodes.filter(CommentNode.is).map(v => v.comment).join(''),
		}
		return ans
	}
)
