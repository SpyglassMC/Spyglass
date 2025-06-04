import * as core from '@spyglassmc/core'

export interface MacroNode
	extends core.SequenceNode<MacroPrefixNode | MacroOtherNode | MacroArgumentNode>
{
	type: 'mcfunction:macro'
	children: (MacroPrefixNode | MacroOtherNode | MacroArgumentNode)[]
}
export namespace MacroNode {
	/* istanbul ignore next */
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroNode, T> {
		return (obj as MacroNode | undefined)?.type === 'mcfunction:macro'
	}

	export function mock(range: core.RangeLike): MacroNode {
		return { type: 'mcfunction:macro', range: core.Range.get(range), children: [] }
	}
}

export interface MacroPrefixNode extends core.AstNode {
	type: 'mcfunction:macro/prefix'
}

export interface MacroOtherNode extends core.AstNode {
	type: 'mcfunction:macro/other'
	value?: string
}

export interface MacroArgumentNode extends core.AstNode {
	type: 'mcfunction:macro/argument'
	value?: string
}
