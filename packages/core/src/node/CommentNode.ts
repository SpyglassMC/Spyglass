import { AstNode } from './AstNode'

export interface CommentNode extends AstNode {
	type: 'comment',
	comment: string,
}

export namespace CommentNode {
	export function is(obj: AstNode): obj is CommentNode {
		return (obj as CommentNode).type === 'comment'
	}
}
