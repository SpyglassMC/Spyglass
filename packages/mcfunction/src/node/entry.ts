import type * as core from '@spyglassmc/core'
import type { CommandNode } from './command.js'
import type { MacroNode } from './macro.js'

export interface McfunctionNode
	extends core.SequenceNode<CommandNode | MacroNode | core.CommentNode | core.ErrorNode>
{
	type: 'mcfunction:entry'
}
export namespace McfunctionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is McfunctionNode {
		return (node as McfunctionNode | undefined)?.type === 'mcfunction:entry'
	}
}
