import * as core from '@spyglassmc/core'

export interface MacroNode extends
	core.SequenceNode<
		MacroGapNode | MacroVariableNode | MacroKeyNode | MacroSignNode
	>
{
	type: 'mcfunction:macro'
	slash?: core.Range
	children: (MacroGapNode | MacroVariableNode | MacroKeyNode | MacroSignNode)[]
}
export namespace MacroNode {
	/* istanbul ignore next */
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroNode, T> {
		return (obj as MacroNode | undefined)?.type ===
			'mcfunction:macro'
	}

	export function mock(range: core.RangeLike): MacroNode {
		return {
			type: 'mcfunction:macro',
			range: core.Range.get(range),
			children: [MacroChildNode.mock(range)],
		}
	}
}

export interface MacroGapNode extends core.AstNode {
	type: 'mcfunction:macro/gap'
	value?: string
	children?: [core.AstNode]
}
export namespace MacroGapNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroGapNode, T> {
		const type = (obj as MacroGapNode | undefined)?.type
		return type === 'mcfunction:macro/gap'
	}
	export function mock(range: core.RangeLike): MacroGapNode {
		return {
			type: 'mcfunction:macro/gap',
			range: core.Range.get(range),
		}
	}
}

export interface MacroVariableNode extends core.AstNode {
	type: 'mcfunction:macro/variable'
	value?: string
	children?: [core.AstNode]
}
export namespace MacroChildNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroVariableNode, T> {
		const type = (obj as MacroVariableNode | undefined)?.type
		return type === 'mcfunction:macro/variable'
	}
	export function mock(range: core.RangeLike): MacroVariableNode {
		return {
			type: 'mcfunction:macro/variable',
			range: core.Range.get(range),
		}
	}
}

export interface MacroSignNode extends core.AstNode {
	readonly value: '$'
	type: 'mcfunction:macro/sign'
}

export interface MacroKeyNode extends core.AstNode {
	type: 'mcfunction:macro/key'
	key?: string
}

export namespace MacroKeyNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroKeyNode, T> {
		return (obj as MacroKeyNode | undefined)?.type ===
			'mcfunction:macro/key'
	}
}
