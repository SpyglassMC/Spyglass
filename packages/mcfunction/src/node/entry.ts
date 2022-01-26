import type * as core from '@spyglassmc/core'
import type { CommandNode } from './command'

export interface McfunctionNode extends core.SequenceNode<CommandNode | core.CommentNode> {
	type: 'mcfunction:entry',
}
export namespace McfunctionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is McfunctionNode {
		return (node as McfunctionNode).type === 'mcfunction:entry'
	}
}
