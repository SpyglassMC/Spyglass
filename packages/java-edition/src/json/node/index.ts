import type * as core from '@spyglassmc/core'

export type TextureSlotKind = 'definition' | 'value' | 'reference'

export interface TextureSlotNode extends core.AstNode {
	type: 'java_edition:texture_slot'
	kind: TextureSlotKind
	children: (core.LiteralNode | core.SymbolNode | core.ResourceLocationNode)[]
	slot?: core.SymbolNode
	id?: core.ResourceLocationNode
}

export namespace TextureSlotNode {
	export function is(node: core.AstNode): node is TextureSlotNode {
		return (node as TextureSlotNode)?.type === 'java_edition:texture_slot'
	}
}

export interface TranslationValueNode extends core.AstNode {
	type: 'java_edition:translation_value'
	children: core.LiteralNode[]
	value: string
}

export namespace TranslationValueNode {
	export function is(node: core.AstNode): node is TranslationValueNode {
		return (node as TranslationValueNode)?.type === 'java_edition:translation_value'
	}
}
