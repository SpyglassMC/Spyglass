import * as core from '@spyglassmc/core'

export interface CommandOptions {
	slash?: 'allowed' | 'required'
	maxLength?: number
}

export interface CommandNode extends core.SequenceNode<CommandChildNode> {
	type: 'mcfunction:command'
	readonly options: CommandOptions
	slash?: core.Range
}
export namespace CommandNode {
	/* istanbul ignore next */
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		node: T,
	): node is core.InheritReadonly<CommandNode, T> {
		return (node as CommandNode | undefined)?.type === 'mcfunction:command'
	}

	export function mock(range: core.RangeLike, options: CommandOptions = {}): CommandNode {
		return { type: 'mcfunction:command', range: core.Range.get(range), children: [], options }
	}
}

export interface CommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child'
	/**
	 * The path of this node in the command tree. Empty if the current node does not correspond to an actual tree node.
	 */
	path: string[]
	children: [core.AstNode]
}
export namespace CommandChildNode {
	export function is(node: core.AstNode): node is CommandChildNode {
		return (node as CommandChildNode).type === 'mcfunction:command_child'
	}
}

export interface TrailingCommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child/trailing'
	value: string
}

export interface UnknownCommandChildNode extends core.AstNode {
	type: 'mcfunction:command_child/unknown'
	value: string
}

export interface LiteralCommandChildNode extends core.LiteralBaseNode {
	type: 'mcfunction:command_child/literal'
}
export namespace LiteralCommandChildNode {
	export function is(node: core.AstNode | undefined): node is LiteralCommandChildNode {
		return ((node as LiteralCommandChildNode | undefined)?.type
			=== 'mcfunction:command_child/literal')
	}
}
