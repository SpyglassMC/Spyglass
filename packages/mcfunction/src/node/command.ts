import type * as core from '@spyglassmc/core'
import type { SpecialArgumentNode } from './argument'

/**
 * @template A Type of argument nodes of this command.
 */
export interface CommandNode<A extends core.AstNode> extends core.SequenceNode<A | SpecialArgumentNode> {
	type: 'mcfunction:command',
	slash?: core.Range,
}
export namespace CommandNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is CommandNode<any> {
		return (node as CommandNode<any>).type === 'mcfunction:command'
	}
}

export interface ChildBaseExtender {
	/**
	 * The name of this node in the command tree.
	 */
	name: string,
}

export interface ChildBaseNode extends core.AstNode, ChildBaseExtender {}
