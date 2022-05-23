import type { AstNode } from './AstNode.js'

export interface CommentNode extends AstNode {
	readonly type: 'comment',
	/**
	 * The actual comment with prefixes and suffixes removed.
	 */
	readonly comment: string,
}

export namespace CommentNode {
	export function is(obj: AstNode | undefined): obj is CommentNode {
		return (obj as CommentNode | undefined)?.type === 'comment'
	}
}
