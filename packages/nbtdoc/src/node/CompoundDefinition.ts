import { AstNode } from '@spyglassmc/core'
import { DocCommentsNode, IdentifierPathToken, IdentifierToken, LiteralToken, MinecraftIdentifierToken, StringToken, Syntax } from './index'

export interface CompoundDefinitionNode extends AstNode, Syntax<CompoundChild> {
	type: 'nbtdoc:compound_definition',
	identifier: IdentifierToken,
	extends: CompoundExtendable | null,
	fields: CompoundFieldNode[],
}

export type CompoundChild = DocCommentsNode | LiteralToken | IdentifierToken | CompoundFieldNode | CompoundExtendable

export interface RegistryIndexNode extends AstNode, Syntax {
	type: 'nbtdoc:registry_index',
	registry: MinecraftIdentifierToken,
	path: FieldPathKey[],
}
export namespace RegistryIndexNode {
	export function is(obj: object): obj is RegistryIndexNode {
		return (obj as RegistryIndexNode).type === 'nbtdoc:registry_index'
	}
}

export type CompoundExtendable = RegistryIndexNode | IdentifierPathToken
export namespace CompoundExtendable {
	export function is(obj: object): obj is CompoundExtendable {
		return RegistryIndexNode.is(obj) || IdentifierPathToken.is(obj)
	}
}

export interface CompoundFieldNode extends AstNode, Syntax<CompoundFieldChild> {
	type: 'nbtdoc:compound_definition/field',
	doc: DocCommentsNode,
	key: CompoundFieldKey,
	fieldType: CompoundFieldTypeNode,
}
export namespace CompoundFieldNode {
	export function is(obj: object): obj is CompoundFieldNode {
		return (obj as CompoundFieldNode).type === 'nbtdoc:compound_definition/field'
	}
}

export type CompoundFieldChild = DocCommentsNode | CompoundFieldKey | LiteralToken | CompoundFieldTypeNode

export type CompoundFieldKey = IdentifierToken | StringToken
export namespace CompoundFieldKey {
	export function is(obj: object): obj is CompoundFieldKey {
		return IdentifierToken.is(obj) || StringToken.is(obj)
	}
}

export const CompoundFieldTypes = ['byte', 'short', 'int', 'long', 'string', 'float', 'double'] as const
export type CompoundFieldType = typeof CompoundFieldTypes[number]
export interface CompoundFieldTypeNode extends AstNode {
	type: 'nbtdoc:compound_definition/field/type'
}
export namespace CompoundFieldTypeNode {
	export function is(obj: object): obj is CompoundFieldTypeNode {
		return (obj as CompoundFieldTypeNode).type === 'nbtdoc:compound_definition/field/type'
	}
}

export type FieldPathKey = LiteralToken<'super'> | IdentifierToken | StringToken
export namespace FieldPathKey {
	export function is(obj: object): obj is FieldPathKey {
		return LiteralToken.is('super')(obj) || IdentifierPathToken.is(obj) || StringToken.is(obj)
	}
}

export type RegistryIndexChild = MinecraftIdentifierToken | LiteralToken | FieldPathKey
