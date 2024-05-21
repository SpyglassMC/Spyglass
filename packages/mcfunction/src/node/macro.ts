import * as core from '@spyglassmc/core'

export interface CommandMacroNode extends core.AstNode {
	type: 'mcfunction:command_macro'
}

export namespace CommandMacroNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<CommandMacroNode, T> {
		return (obj as CommandMacroNode | undefined)?.type ===
			'mcfunction:command_macro'
	}
}

export interface MacroNode extends core.SequenceNode<MacroChildNode> {
	type: 'mcfunction:macro'
	slash?: core.Range
}
export namespace MacroNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is MacroNode {
		return (node as MacroNode).type === 'mcfunction:macro'
	}

	export function mock(range: core.RangeLike): MacroNode {
		return {
			type: 'mcfunction:macro',
			range: core.Range.get(range),
			children: [],
		}
	}
}

export interface MacroOptions {
    type?: 'macro' | 'other'
	colorTokenType?: core.ColorTokenType
}

export interface MacroChildNode extends core.AstNode {
    readonly options: MacroOptions
	type: 'mcfunction:macro_child'
	/**
	 * The path of this node in the macro tree. Empty if the current node does not correspond to an actual tree node.
	 */
	path: string[]
	//children: [core.AstNode]
}
export namespace MacroChildNode {
	export function is(node: core.AstNode): node is MacroChildNode {
		return (node as MacroChildNode).type === 'mcfunction:macro_child'
	}
}