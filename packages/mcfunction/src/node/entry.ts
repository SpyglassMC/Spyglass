import type * as core from '@spyglassmc/core'
import type { CommandNode } from './command'

export interface McfunctionNode<A extends core.AstNode> extends core.SequenceNode<CommandNode<A> | core.CommentNode> {
	type: 'mcfunction:entry',
}
export namespace McfunctionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is McfunctionNode<any> {
		return (node as McfunctionNode<any>).type === 'mcfunction:entry'
	}
}
