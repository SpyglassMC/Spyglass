import type { AstNode, CommentNode, FloatNode, IntegerNode, ResourceLocationNode, SequenceNode, SequenceUtil } from '@spyglassmc/core'
import { StringNode } from '@spyglassmc/core'
import type { CompoundDefinitionNode, CompoundFieldTypeNode } from './Struct'
import type { EnumDefinitionNode } from './Enum'
import type { InjectClauseNode } from './InjectClause'

export type SyntaxNode<CN extends AstNode = AstNode> = SequenceNode<CN | CommentNode>
export type SyntaxUtil<CN extends AstNode = AstNode> = SequenceUtil<CN | CommentNode>

export interface LiteralToken<T extends string = string> extends AstNode {
	type: 'mcdoc:literal',
	value: T,
}
export namespace LiteralToken {
	export function is<T extends string>(literal?: T | T[] | readonly T[]): (obj: object) => obj is LiteralToken<T> {
		return (obj: object): obj is LiteralToken<T> => (
			(obj as LiteralToken).type === 'mcdoc:literal' &&
			(literal === undefined || (Array.isArray(literal) ? literal.includes((obj as LiteralToken<T>).value) : (obj as LiteralToken).value === literal))
		)
	}
}

export interface IdentifierToken extends AstNode {
	type: 'mcdoc:identifier',
	value: string,
}
export namespace IdentifierToken {
	export function is(obj: object | undefined): obj is IdentifierToken {
		return (obj as IdentifierToken | undefined)?.type === 'mcdoc:identifier'
	}
}

export interface IdentPathToken extends AstNode {
	type: 'mcdoc:ident_path',
	fromGlobalRoot: boolean,
	children: (IdentifierToken | LiteralToken<'super'>)[],
}
export namespace IdentPathToken {
	export function is(obj: object): obj is IdentPathToken {
		return (obj as IdentPathToken).type === 'mcdoc:ident_path'
	}
}

export type Primitive = FloatNode | IntegerNode | StringNode
export namespace Primitive {
	export function is(obj: object): obj is Primitive {
		return (obj as Primitive).type === 'float' ||
			(obj as Primitive).type === 'integer' ||
			StringNode.is(obj)
	}
}

export interface DocCommentsNode extends SyntaxNode<CommentNode> {
	type: 'mcdoc:doc_comments',
	value: string,
}
export namespace DocCommentsNode {
	export function is(obj: object): obj is DocCommentsNode {
		return (obj as DocCommentsNode).type === 'mcdoc:doc_comments'
	}
}

export interface DescribesClauseNode extends SyntaxNode<IdentPathToken | LiteralToken | ResourceLocationNode> {
	type: 'mcdoc:describes_clause',
	path: IdentPathToken,
	registry: ResourceLocationNode,
	objects: ResourceLocationNode[] | undefined,
}

export interface ModuleDeclarationNode extends SyntaxNode<LiteralToken | IdentifierToken> {
	type: 'mcdoc:module_declaration',
	identifier: IdentifierToken,
}

export interface UseClauseNode extends SyntaxNode<LiteralToken | IdentPathToken> {
	type: 'mcdoc:use_clause',
	isExport: boolean,
	path: IdentPathToken,
}

export type ContentNode =
	| CommentNode
	| CompoundDefinitionNode
	| EnumDefinitionNode
	| ModuleDeclarationNode
	| UseClauseNode
	| DescribesClauseNode
	| InjectClauseNode

export interface MainNode extends SyntaxNode {
	type: 'mcdoc:main',
	children: ContentNode[],
}

export type LeafNode =
	| LiteralToken
	| IdentifierToken
	| ResourceLocationNode
	| Primitive
	| CommentNode
	| CompoundFieldTypeNode

export const ExtendableRootRegistryMap = {
	'minecraft:block': 'block',
	'minecraft:entity': 'entity_type',
	'minecraft:item': 'item',
	'minecraft:storage': 'storage',
} as const
export const ExtendableRootRegistries = Object.keys(ExtendableRootRegistryMap) as (keyof typeof ExtendableRootRegistryMap)[]
export type ExtendableRootRegistry = (typeof ExtendableRootRegistryMap)[keyof typeof ExtendableRootRegistryMap]
export namespace ExtendableRootRegistry {
	export function is(str: string): str is ExtendableRootRegistry {
		return Object.values(ExtendableRootRegistryMap).includes(str as ExtendableRootRegistry)
	}
}

export const CustomRootRegistryMap = {
	'custom:blockitemstates': 'custom:blockitemstates',
	'custom:blockstates': 'custom:blockstates',
	'custom:spawnitemtag': 'custom:spawnitemtag',
} as const
export const CustomRootRegistries = Object.keys(CustomRootRegistryMap) as (keyof typeof CustomRootRegistryMap)[]
export type CustomRootRegistry = (typeof CustomRootRegistryMap)[keyof typeof CustomRootRegistryMap]

export const RootRegistryMap = {
	...ExtendableRootRegistryMap,
	...CustomRootRegistryMap,
} as const
export const RootRegistries = Object.keys(RootRegistryMap) as (keyof typeof RootRegistryMap)[]
export type ResolvedRootRegistry = (typeof RootRegistryMap)[keyof typeof RootRegistryMap]

export const IdRegistryMap = {
	'minecraft:attribute': 'attribute',
	'minecraft:block': 'block',
	'minecraft:block_entity': 'block_entity_type',
	'minecraft:dimension': 'dimension',
	'minecraft:enchantment': 'enchantment',
	'minecraft:entity': 'entity_type',
	'minecraft:item': 'item',
	'minecraft:loot_table': 'loot_table',
	'minecraft:motive': 'motive',
	'minecraft:potion': 'potion',
	'minecraft:recipe': 'recipe',
	'minecraft:structure': 'structure',
	'minecraft:villager_profession': 'villager_profession',
	'minecraft:villager_type': 'villager_type',
} as const
export const IdRegistries = Object.keys(IdRegistryMap) as (keyof typeof IdRegistryMap)[]
export type ResolvedIdRegistry = (typeof IdRegistryMap)[keyof typeof IdRegistryMap]
