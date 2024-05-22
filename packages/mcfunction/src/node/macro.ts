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


export interface MacroOptions {
    type?: 'macro' | 'other' | 'sign'
	colorTokenType?: core.ColorTokenType
}

export interface MacroChildNode extends core.AstNode {
    readonly options: MacroOptions
	type: 'mcfunction:macro_child'
    value?: String
	children?: [core.AstNode]
}
export namespace MacroChildNode {
	export function is<T extends core.DeepReadonly<core.AstNode> | undefined>(
		obj: T,
	): obj is core.InheritReadonly<MacroChildNode, T> {
		return (obj as MacroChildNode | undefined)?.type ===
			'mcfunction:macro_child'
	}
    export function mock(range: core.RangeLike): MacroChildNode {
        return {
            type: 'mcfunction:macro_child',
            range: core.Range.get(range),
            options: {},
        }
    }
}

export interface MacroKeyNode extends core.AstNode {
	type: 'mcfunction:macro_key'
	colorTokenType?: core.ColorTokenType
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