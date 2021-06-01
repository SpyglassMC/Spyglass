import type { DocCommentsNode, IdentifierToken, LiteralToken, Primitive, SyntaxNode } from './misc'

export interface EnumDefinitionNode extends SyntaxNode<EnumChild> {
	type: 'nbtdoc:enum_definition'
	doc: DocCommentsNode
	enumType: LiteralToken<EnumTypeOrEmpty>
	identifier: IdentifierToken
	fields: EnumFieldNode[]
}
export namespace EnumDefinitionNode {
	export interface SymbolData {
		enumType?: EnumType
	}
	export function toSymbolData(node: EnumDefinitionNode): SymbolData {
		return {
			enumType: node.enumType.value || undefined,
		}
	}
}

export type EnumChild = DocCommentsNode | LiteralToken | IdentifierToken | EnumFieldNode

export interface EnumFieldNode extends SyntaxNode<EnumFieldChild> {
	type: 'nbtdoc:enum_definition/field'
	doc: DocCommentsNode
	key: IdentifierToken
	value: Primitive
}
export namespace EnumFieldNode {
	export function is(obj: object): obj is EnumFieldNode {
		return (obj as EnumFieldNode).type === 'nbtdoc:enum_definition/field'
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

export const EnumTypes = ['byte', 'short', 'int', 'long', 'string', 'float', 'double'] as const
export type EnumType = typeof EnumTypes[number]

export const EnumTypesOrEmpty = [...EnumTypes, ''] as const
export type EnumTypeOrEmpty = typeof EnumTypesOrEmpty[number]
