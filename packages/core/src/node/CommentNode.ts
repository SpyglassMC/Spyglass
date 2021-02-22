import { AstNode } from './AstNode'

export interface CommentNode extends AstNode {
	type: 'comment',
	comment: string,
}
