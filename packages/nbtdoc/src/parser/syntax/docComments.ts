import { CommentNode, InfallibleParser, wrap } from '@spyglassmc/core'
import { DocCommentsNode } from '../../node'
import { docComment } from '../terminator'
import { repeat } from '../util'

/**
 * @returns A parser that takes zero or more doc comments.
 */
export function docComments(): InfallibleParser<DocCommentsNode> {
	return wrap(
		repeat<CommentNode>(docComment(), true),
		res => ({
			type: 'nbtdoc:doc_comments',
			nodes: res.nodes,
			doc: res.nodes.filter(CommentNode.is).map(v => v.comment).join(''),
		})
	)
}
