import type * as core from '@spyglassmc/core'
import type { ArgumentNode } from './argument'

export interface CommandNode extends core.SequenceNode<ArgumentNode> {
	type: 'mcfunction:command',
	slash?: core.Range,
}
export namespace CommandNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is CommandNode {
		return (node as CommandNode).type === 'mcfunction:command'
	}
}

export interface CommandChildNodeExtender {
	/**
	 * The name of this node in the command tree.
	 */
	name: string,
}

export interface CommandChildBaseNode extends core.AstNode, CommandChildNodeExtender {}
