import type * as core from '@spyglassmc/core'

export interface CommandNode extends core.SequenceNode<CommandChildNode> {
	type: 'mcfunction:command',
	slash?: core.Range,
}
export namespace CommandNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is CommandNode {
		return (node as CommandNode).type === 'mcfunction:command'
	}
}

export interface CommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child',
	/**
	 * The path of this node in the command tree. Undefined if the current node does not correspond to an actual tree node.
	 */
	path: string[] | undefined,
	children: [core.AstNode],
}

export interface TrailingCommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child/trailing',
	value: string,
}

export interface UnknownCommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child/unknown',
	value: string,
}

export interface LiteralCommandChildNode extends core.LiteralBaseNode {
	type: 'mcfunction:command_child/literal',
}
export namespace CommandChildNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is CommandChildNode {
		return (node as CommandChildNode).type === 'mcfunction:command_child'
	}
}
