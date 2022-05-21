import type { AstNode, ColorTokenType, FloatNode, IntegerNode, ItemNode, ListNode, RecordBaseNode, SymbolBaseNode } from '@spyglassmc/core'
import { CommentNode, ResourceLocationNode, StringNode } from '@spyglassmc/core'
import type { McdocType } from '../type'

export interface ModuleNode extends AstNode {
	type: 'mcdoc:module',
	children: TopLevelNode[],
}
export const ModuleNode = Object.freeze({
	is(node: AstNode | undefined): node is ModuleNode {
		return (node as ModuleNode | undefined)?.type === 'mcdoc:module'
	},
})

export type TopLevelNode =
	| CommentNode
	| DispatchStatementNode
	| EnumNode
	| InjectionNode
	| StructNode
	| TypeAliasNode
	| UseStatementNode
export const TopLevelNode = Object.freeze({
	is(node: AstNode | undefined): node is TopLevelNode {
		return (
			CommentNode.is(node) ||
			DispatchStatementNode.is(node) ||
			EnumNode.is(node) ||
			InjectionNode.is(node) ||
			StructNode.is(node) ||
			TypeAliasNode.is(node) ||
			UseStatementNode.is(node)
		)
	},
})

export interface DispatchStatementNode extends AstNode {
	type: 'mcdoc:dispatch_statement',
	children: (CommentNode | LiteralNode | ResourceLocationNode | IndexBodyNode | TypeNode)[]
}
export const DispatchStatementNode = Object.freeze({
	is(node: AstNode | undefined): node is DispatchStatementNode {
		return (node as DispatchStatementNode | undefined)?.type === 'mcdoc:dispatch_statement'
	},
})

export interface LiteralNode extends AstNode {
	type: 'mcdoc:literal',
	value: string,
	colorTokenType?: ColorTokenType,
}
export const LiteralNode = Object.freeze({
	is(node: AstNode | undefined): node is LiteralNode {
		return (node as LiteralNode | undefined)?.type === 'mcdoc:literal'
	},
})

export interface IndexBodyNode extends AstNode {
	type: 'mcdoc:index_body',
	children: (CommentNode | IndexNode)[],
}
export const IndexBodyNode = Object.freeze({
	is(node: AstNode | undefined): node is IndexBodyNode {
		return (node as IndexBodyNode | undefined)?.type === 'mcdoc:index_body'
	},
})

export type IndexNode = StaticIndexNode | DynamicIndexNode
export const IndexNode = Object.freeze({
	is(node: AstNode | undefined): node is IndexNode {
		return StaticIndexNode.is(node) || DynamicIndexNode.is(node)
	},
})

export type StaticIndexNode = LiteralNode | IdentifierNode | StringNode | ResourceLocationNode
export const StaticIndexNode = Object.freeze({
	is(node: AstNode | undefined): node is StaticIndexNode {
		return LiteralNode.is(node) || IdentifierNode.is(node) || StringNode.is(node) || ResourceLocationNode.is(node)
	},
})

export interface IdentifierNode extends SymbolBaseNode {
	type: 'mcdoc:identifier',
}
export const IdentifierNode = Object.freeze({
	is(node: AstNode | undefined): node is IdentifierNode {
		return (node as IdentifierNode | undefined)?.type === 'mcdoc:identifier'
	},
})

export interface DynamicIndexNode extends AstNode {
	type: 'mcdoc:dynamic_index',
	children: (CommentNode | AccessorKeyNode)[],
}
export const DynamicIndexNode = Object.freeze({
	is(node: AstNode | undefined): node is DynamicIndexNode {
		return (node as DynamicIndexNode | undefined)?.type === 'mcdoc:dynamic_index'
	},
})

export type AccessorKeyNode = LiteralNode | IdentifierNode | StringNode
export const AccessorKeyNode = Object.freeze({
	is(node: AstNode | undefined): node is AccessorKeyNode {
		return LiteralNode.is(node) || IdentifierNode.is(node) || StringNode.is(node)
	},
})

export type TypeNode =
	| AnyTypeNode
	| BooleanTypeNode
	| StringTypeNode
	| LiteralTypeNode
	| NumericTypeNode
	| PrimitiveArrayTypeNode
	| ListTypeNode
	| TupleTypeNode
	| EnumNode
	| StructNode
	| PathNode
	| DispatcherTypeNode
	| UnionTypeNode
export const TypeNode = Object.freeze({
	is(node: AstNode | undefined): node is TypeNode {
		return (
			AnyTypeNode.is(node) ||
			BooleanTypeNode.is(node) ||
			StringTypeNode.is(node) ||
			LiteralTypeNode.is(node) ||
			NumericTypeNode.is(node) ||
			PrimitiveArrayTypeNode.is(node) ||
			ListTypeNode.is(node) ||
			TupleTypeNode.is(node) ||
			EnumNode.is(node) ||
			StructNode.is(node) ||
			PathNode.is(node) ||
			DispatcherTypeNode.is(node) ||
			UnionTypeNode.is(node)
		)
	},
	asType(node: TypeNode): McdocType {
		throw '// TODO'
	},
})

export interface TypeBaseNode<CN extends AstNode> extends AstNode {
	type: `mcdoc:${string}`,
	children: (CommentNode | AttributeNode | IndexBodyNode | CN)[]
}

export interface AttributeNode extends AstNode {
	type: 'mcdoc:attribute',
	children: (CommentNode | IdentifierNode | AttributeValueNode)[],
	sep?: boolean,
}
export const AttributeNode = Object.freeze({
	is(node: AstNode | undefined): node is AttributeNode {
		return (node as AttributeNode | undefined)?.type === 'mcdoc:attribute'
	},
})

export type AttributeValueNode = TypeNode | AttributeTreeNode
export const AttributeValueNode = Object.freeze({
	is(node: AstNode | undefined): node is AttributeValueNode {
		return TypeNode.is(node) || AttributeTreeNode.is(node)
	},
})

export interface AttributeTreeNode extends AstNode {
	type: 'mcdoc:attribute/tree',
	children: (CommentNode | AttributeTreePosValuesNode | AttributeTreeNamedValuesNode)[],
	delim: '(' | '[' | '{',
}
export const AttributeTreeNode = Object.freeze({
	is(node: AstNode | undefined): node is AttributeTreeNode {
		return (node as AttributeTreeNode | undefined)?.type === 'mcdoc:attribute/tree'
	},
})

export interface AttributeTreePosValuesNode extends ListNode<AttributeValueNode> {
	type: 'mcdoc:attribute/tree/pos',
}
export const AttributeTreePosValuesNode = Object.freeze({
	is(node: AstNode | undefined): node is AttributeTreePosValuesNode {
		return (node as AttributeTreePosValuesNode | undefined)?.type === 'mcdoc:attribute/tree/pos'
	},
})

export interface AttributeTreeNamedValuesNode extends RecordBaseNode<IdentifierNode | StringNode, AttributeValueNode> {
	type: 'mcdoc:attribute/tree/named',
}
export const AttributeTreeNamedValuesNode = Object.freeze({
	is(node: AstNode | undefined): node is AttributeTreeNamedValuesNode {
		return (node as AttributeTreeNamedValuesNode | undefined)?.type === 'mcdoc:attribute/tree/named'
	},
})

export interface AnyTypeNode extends TypeBaseNode<LiteralNode> {
	type: 'mcdoc:type/any',
}
export const AnyTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is AnyTypeNode {
		return (node as AnyTypeNode | undefined)?.type === 'mcdoc:type/any'
	},
})

export interface BooleanTypeNode extends TypeBaseNode<LiteralNode> {
	type: 'mcdoc:type/boolean',
}
export const BooleanTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is BooleanTypeNode {
		return (node as BooleanTypeNode | undefined)?.type === 'mcdoc:type/boolean'
	},
})

export interface StringTypeNode extends TypeBaseNode<LiteralNode | IntRangeNode> {
	type: 'mcdoc:type/string',
}
export const StringTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is StringTypeNode {
		return (node as StringTypeNode | undefined)?.type === 'mcdoc:type/string'
	},
})

export interface IntRangeNode extends AstNode {
	type: 'mcdoc:int_range',
	children: IntegerNode[],
}
export const IntRangeNode = Object.freeze({
	is(node: AstNode | undefined): node is IntRangeNode {
		return (node as IntRangeNode | undefined)?.type === 'mcdoc:int_range'
	},
})

export interface LiteralTypeNode extends TypeBaseNode<LiteralNode | TypedNumberNode | StringNode> {
	type: 'mcdoc:type/literal',
}
export const LiteralTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is LiteralTypeNode {
		return (node as LiteralTypeNode | undefined)?.type === 'mcdoc:type/literal'
	},
})

export interface TypedNumberNode extends AstNode {
	type: 'mcdoc:typed_number',
	children: (FloatNode | LiteralNode)[],
}
export const TypedNumberNode = Object.freeze({
	is(node: AstNode | undefined): node is TypedNumberNode {
		return (node as TypedNumberNode | undefined)?.type === 'mcdoc:typed_number'
	},
})

export interface NumericTypeNode extends TypeBaseNode<LiteralNode | FloatRangeNode> {
	type: 'mcdoc:type/numeric_type'
}
export const NumericTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is NumericTypeNode {
		return (node as NumericTypeNode | undefined)?.type === 'mcdoc:type/numeric_type'
	},
})

export interface FloatRangeNode extends AstNode {
	type: 'mcdoc:float_range',
	children: FloatNode[],
}
export const FloatRangeNode = Object.freeze({
	is(node: AstNode | undefined): node is FloatRangeNode {
		return (node as FloatRangeNode | undefined)?.type === 'mcdoc:float_range'
	},
})

export interface PrimitiveArrayTypeNode extends TypeBaseNode<LiteralNode | IntRangeNode | FloatRangeNode> {
	type: 'mcdoc:type/primitive_array',
}
export const PrimitiveArrayTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is PrimitiveArrayTypeNode {
		return (node as PrimitiveArrayTypeNode | undefined)?.type === 'mcdoc:type/primitive_array'
	},
})

export interface ListTypeNode extends TypeBaseNode<TypeNode | IntRangeNode> {
	type: 'mcdoc:type/list',
}
export const ListTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is ListTypeNode {
		return (node as ListTypeNode | undefined)?.type === 'mcdoc:type/list'
	},
})

export interface TupleTypeNode extends TypeBaseNode<ItemNode<TypeNode>> {
	type: 'mcdoc:type/tuple',
}
export const TupleTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is TupleTypeNode {
		return (node as TupleTypeNode | undefined)?.type === 'mcdoc:type/tuple'
	},
})

export interface EnumNode extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | EnumBlockNode> {
	type: 'mcdoc:enum',
}
export const EnumNode = Object.freeze({
	is(node: AstNode | undefined): node is EnumNode {
		return (node as EnumNode | undefined)?.type === 'mcdoc:enum'
	},
	kinds: new Set(['byte', 'short', 'int', 'long', 'float', 'double', 'string'] as const),
})
export type EnumKind = typeof EnumNode['kinds'] extends Set<infer V> ? V : never

export interface DocCommentsNode extends AstNode {
	type: 'mcdoc:doc_comments',
	children: CommentNode[],
}
export const DocCommentsNode = Object.freeze({
	is(node: AstNode | undefined): node is DocCommentsNode {
		return (node as DocCommentsNode | undefined)?.type === 'mcdoc:doc_comments'
	},
})

export interface EnumBlockNode extends AstNode {
	type: 'mcdoc:enum/block',
	children: (CommentNode | EnumFieldNode | PrelimNode)[],
}
export const EnumBlockNode = Object.freeze({
	is(node: AstNode | undefined): node is EnumBlockNode {
		return (node as EnumBlockNode | undefined)?.type === 'mcdoc:enum/block'
	},
})

export interface EnumFieldNode extends AstNode {
	type: 'mcdoc:enum/field',
	children: (CommentNode | PrelimNode | IdentifierNode | EnumValueNode)[],
}
export const EnumFieldNode = Object.freeze({
	is(node: AstNode | undefined): node is EnumFieldNode {
		return (node as EnumFieldNode | undefined)?.type === 'mcdoc:enum/field'
	},
})

export type EnumValueNode = TypedNumberNode | StringNode
export const EnumValueNode = Object.freeze({
	is(node: AstNode | undefined): node is EnumValueNode {
		return TypedNumberNode.is(node) || StringNode.is(node)
	},
})

export type PrelimNode = AttributeNode | DocCommentsNode
export const PrelimNode = Object.freeze({
	is(node: AstNode | undefined): node is PrelimNode {
		return AttributeNode.is(node) || DocCommentsNode.is(node)
	},
})

export interface StructNode extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | TypeParamBlockNode | StructBlockNode> {
	type: 'mcdoc:struct',
}
export const StructNode = Object.freeze({
	is(node: AstNode | undefined): node is StructNode {
		return (node as StructNode | undefined)?.type === 'mcdoc:struct'
	},
})

export interface TypeParamBlockNode extends AstNode {
	type: 'mcdoc:type_param_block',
	children: (CommentNode | TypeParamNode)[],
}
export const TypeParamBlockNode = Object.freeze({
	is(node: AstNode | undefined): node is TypeParamBlockNode {
		return (node as TypeParamBlockNode | undefined)?.type === 'mcdoc:type_param_block'
	},
})

export interface TypeParamNode extends AstNode {
	type: 'mcdoc:type_param',
	children: (CommentNode | IdentifierNode | LiteralNode | PathNode)[],
}
export const TypeParamNode = Object.freeze({
	is(node: AstNode | undefined): node is TypeParamNode {
		return (node as TypeParamNode | undefined)?.type === 'mcdoc:type_param'
	},
})

export interface PathNode extends AstNode {
	type: 'mcdoc:path',
	children: (LiteralNode | IdentifierNode)[],
	isAbsolute?: boolean,
}
export const PathNode = Object.freeze({
	is(node: AstNode | undefined): node is PathNode {
		return (node as PathNode | undefined)?.type === 'mcdoc:path'
	},
})

export interface StructBlockNode extends AstNode {
	type: 'mcdoc:struct/block',
	children: (CommentNode | StructFieldNode | PrelimNode)[],
}
export const StructBlockNode = Object.freeze({
	is(node: AstNode | undefined): node is StructBlockNode {
		return (node as StructBlockNode | undefined)?.type === 'mcdoc:struct/block'
	},
})

export type StructFieldNode = StructPairFieldNode | StructSpreadFieldNode
export const StructFieldNode = Object.freeze({
	is(node: AstNode | undefined): node is StructFieldNode {
		return StructPairFieldNode.is(node) || StructSpreadFieldNode.is(node)
	},
})

export interface StructPairFieldNode extends AstNode {
	type: 'mcdoc:struct/field/pair',
	children: (CommentNode | PrelimNode | StructKeyNode | TypeNode)[],
	isOptional?: boolean,
}
export const StructPairFieldNode = Object.freeze({
	is(node: AstNode | undefined): node is StructPairFieldNode {
		return (node as StructPairFieldNode | undefined)?.type === 'mcdoc:struct/field/pair'
	},
})

export type StructKeyNode = StringNode | IdentifierNode | StructMapKeyNode
export const StructKeyNode = Object.freeze({
	is(node: AstNode | undefined): node is StructKeyNode {
		return StringNode.is(node) || IdentifierNode.is(node) || StructMapKeyNode.is(node)
	},
})

export interface StructMapKeyNode extends AstNode {
	type: 'mcdoc:struct/map_key',
	children: (CommentNode | TypeNode)[],
}
export const StructMapKeyNode = Object.freeze({
	is(node: AstNode | undefined): node is StructMapKeyNode {
		return (node as StructMapKeyNode | undefined)?.type === 'mcdoc:struct/map_key'
	},
})

export interface StructSpreadFieldNode extends AstNode {
	type: 'mcdoc:struct/field/spread',
	children: (CommentNode | TypeNode)[],
}
export const StructSpreadFieldNode = Object.freeze({
	is(node: AstNode | undefined): node is StructSpreadFieldNode {
		return (node as StructSpreadFieldNode | undefined)?.type === 'mcdoc:struct/field/spread'
	},
})

export interface DispatcherTypeNode extends TypeBaseNode<ResourceLocationNode | IndexBodyNode> {
	type: 'mcdoc:type/dispatcher',
}
export const DispatcherTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is DispatcherTypeNode {
		return (node as DispatcherTypeNode | undefined)?.type === 'mcdoc:type/dispatcher'
	},
})

export interface UnionTypeNode extends TypeBaseNode<ItemNode<TypeNode>> {
	type: 'mcdoc:type/union',
}
export const UnionTypeNode = Object.freeze({
	is(node: AstNode | undefined): node is UnionTypeNode {
		return (node as UnionTypeNode | undefined)?.type === 'mcdoc:type/union'
	},
})

export interface InjectionNode extends AstNode {
	type: 'mcdoc:injection',
	children: (CommentNode | LiteralNode | EnumInjectionNode | StructInjectionNode)[]
}
export const InjectionNode = Object.freeze({
	is(node: AstNode | undefined): node is InjectionNode {
		return (node as InjectionNode | undefined)?.type === 'mcdoc:injection'
	},
})

export interface EnumInjectionNode extends AstNode {
	type: 'mcdoc:injection/enum',
	children: (CommentNode | LiteralNode | PathNode | EnumBlockNode)[],
}
export const EnumInjectionNode = Object.freeze({
	is(node: AstNode | undefined): node is EnumInjectionNode {
		return (node as EnumInjectionNode | undefined)?.type === 'mcdoc:injection/enum'
	},
})

export interface StructInjectionNode extends AstNode {
	type: 'mcdoc:injection/struct',
	children: (CommentNode | LiteralNode | PathNode | TypeParamBlockNode | StructBlockNode)[],
}
export const StructInjectionNode = Object.freeze({
	is(node: AstNode | undefined): node is StructInjectionNode {
		return (node as StructInjectionNode | undefined)?.type === 'mcdoc:injection/struct'
	},
})

export interface TypeAliasNode extends AstNode {
	type: 'mcdoc:type_alias',
	children: (CommentNode | PrelimNode | LiteralNode | IdentifierNode | TypeParamBlockNode | TypeNode)[],
}
export const TypeAliasNode = Object.freeze({
	is(node: AstNode | undefined): node is TypeAliasNode {
		return (node as TypeAliasNode | undefined)?.type === 'mcdoc:type_alias'
	},
})

export interface UseStatementNode extends AstNode {
	type: 'mcdoc:use_statement',
	children: (CommentNode | LiteralNode | PathNode | IdentifierNode)[]
}
export const UseStatementNode = Object.freeze({
	is(node: AstNode | undefined): node is UseStatementNode {
		return (node as UseStatementNode | undefined)?.type === 'mcdoc:use_statement'
	},
})
