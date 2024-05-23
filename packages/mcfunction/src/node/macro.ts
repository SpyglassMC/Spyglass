import * as core from '@spyglassmc/core'

export interface MacroNode extends core.SequenceNode<MacroChildNode> {
	type: 'mcfunction:macro'
	slash?: core.Range
	children: MacroChildNode[]
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

export interface MacroChildNode extends core.AstNode {
	type:
		| 'mcfunction:macro_child/macro'
		| 'mcfunction:macro_child/other'
	value?: String
	children?: [core.AstNode]
}
export namespace MacroChildNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroChildNode, T> {
		const type = (obj as MacroChildNode | undefined)?.type
		return type === 'mcfunction:macro_child/macro' ||
			type === 'mcfunction:macro_child/other'
	}
	export function mock(range: core.RangeLike): MacroChildNode {
		return {
			type: 'mcfunction:macro_child/other',
			range: core.Range.get(range),
		}
	}
}

export interface MacroKeyNode extends core.AstNode {
	type: 'mcfunction:macro_key'
	key?: string
}

export namespace MacroKeyNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroKeyNode, T> {
		return (obj as MacroKeyNode | undefined)?.type ===
			'mcfunction:macro_key'
	}
}
