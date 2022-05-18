import type { DocCommentsNode, IdentifierToken, LiteralToken, Primitive, SyntaxNode } from './misc'

export interface EnumDefinitionNode extends SyntaxNode<EnumChild> {
	type: 'mcdoc:enum'
	doc: DocCommentsNode
	enumKind: LiteralToken<EnumKindOrEmpty>
	identifier: IdentifierToken
	fields: EnumFieldNode[]
}
export namespace EnumDefinitionNode {
	export interface SymbolData {
		enumKind?: EnumKind
	}
	export function toSymbolData(node: EnumDefinitionNode): SymbolData {
		return {
			enumKind: node.enumKind.value || undefined,
		}
	}
}

export type EnumChild = DocCommentsNode | LiteralToken | IdentifierToken | EnumFieldNode

export interface EnumFieldNode extends SyntaxNode<EnumFieldChild> {
	type: 'mcdoc:enum/field'
	doc: DocCommentsNode
	key: IdentifierToken
	value: Primitive
}
export namespace EnumFieldNode {
	export function is(obj: object): obj is EnumFieldNode {
		return (obj as EnumFieldNode).type === 'mcdoc:enum/field'
	}

	export interface SymbolData {
		value: number | string
	}
	export function toSymbolData(node: EnumFieldNode): SymbolData {
		return {
			value: node.value.value,
		}
	}
}

export type EnumFieldChild = DocCommentsNode | LiteralToken | IdentifierToken | Primitive

export const EnumKinds = ['byte', 'short', 'int', 'long', 'string', 'float', 'double'] as const
export type EnumKind = typeof EnumKinds[number]

export const EnumKindsOrEmpty = [...EnumKinds, ''] as const
export type EnumKindOrEmpty = typeof EnumKindsOrEmpty[number]
