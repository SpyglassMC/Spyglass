import type { DeepReadonly, InheritReadonly, ReadWrite } from '../common/index.js'
import type { AstNode } from './AstNode.js'

export interface CommentNode extends AstNode {
	readonly type: 'comment'
	/**
	 * The actual comment with prefixes and suffixes removed.
	 */
	comment: string
	/**
	 * The prefix used to start the comment
	 */
	prefix: string
}

export namespace CommentNode {
	export function is<T extends DeepReadonly<AstNode> | undefined>(
		obj: T,
	): obj is InheritReadonly<CommentNode, T> {
		return (obj as CommentNode | undefined)?.type === 'comment'
	}
}
