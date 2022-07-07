import type { AstNode, ColorTokenType, IntegerNode, SymbolBaseNode } from '@spyglassmc/core'
import { atArray, CommentNode, FloatNode, ResourceLocationNode, StringNode } from '@spyglassmc/core'

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
	children: (CommentNode | AttributeNode | LiteralNode | ResourceLocationNode | IndexBodyNode | TypeNode)[]
}
export const DispatchStatementNode = Object.freeze({
	destruct(node: DispatchStatementNode): {
		attributes: AttributeNode[],
		location?: ResourceLocationNode,
		index?: IndexBodyNode,
		target?: TypeNode,
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			location: node.children.find(ResourceLocationNode.is),
			index: node.children.find(IndexBodyNode.is),
			target: node.children.find(TypeNode.is),
		}
	},
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
	destruct(node: IndexBodyNode): {
		parallelIndices: IndexNode[],
	} {
		return {
			parallelIndices: node.children.filter(IndexNode.is),
		}
	},
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
	destruct(node: DynamicIndexNode): {
		keys: AccessorKeyNode[],
	} {
		return {
			keys: node.children.filter(AccessorKeyNode.is),
		}
	},
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
	| ReferenceTypeNode
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
			ReferenceTypeNode.is(node) ||
			DispatcherTypeNode.is(node) ||
			UnionTypeNode.is(node)
		)
	},
})

export interface TypeBaseNode<CN extends AstNode> extends AstNode {
	type: `mcdoc:${string}`,
	children: (CommentNode | AttributeNode | IndexBodyNode | CN)[]
}
export const TypeBaseNode = Object.freeze({
	destruct(node: TypeBaseNode<any>): {
		attributes: AttributeNode[],
		indices: IndexBodyNode[],
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			indices: node.children.filter(IndexBodyNode.is),
		}
	},
})

export interface AttributeNode extends AstNode {
	type: 'mcdoc:attribute',
	children: (CommentNode | IdentifierNode | AttributeValueNode)[],
}
export const AttributeNode = Object.freeze({
	destruct(node: AttributeNode): {
		name: IdentifierNode,
		value: AttributeValueNode | undefined,
	} {
		return {
			name: node.children.find(IdentifierNode.is)!,
			value: node.children.find(AttributeValueNode.is),
		}
	},
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
	destruct(node: AttributeTreeNode): {
		positional?: AttributeTreePosValuesNode,
		named?: AttributeTreeNamedValuesNode,
	} {
		return {
			positional: node.children.find(AttributeTreePosValuesNode.is),
			named: node.children.find(AttributeTreeNamedValuesNode.is),
		}
	},
	is(node: AstNode | undefined): node is AttributeTreeNode {
		return (node as AttributeTreeNode | undefined)?.type === 'mcdoc:attribute/tree'
	},
})

export interface AttributeTreePosValuesNode extends AstNode {
	type: 'mcdoc:attribute/tree/pos',
	children: (CommentNode | AttributeValueNode)[],
}
export const AttributeTreePosValuesNode = Object.freeze({
	destruct(node: AttributeTreePosValuesNode): {
		values: AttributeValueNode[],
	} {
		return {
			values: node.children.filter(AttributeValueNode.is),
		}
	},
	is(node: AstNode | undefined): node is AttributeTreePosValuesNode {
		return (node as AttributeTreePosValuesNode | undefined)?.type === 'mcdoc:attribute/tree/pos'
	},
})

export interface AttributeTreeNamedValuesNode extends AstNode {
	type: 'mcdoc:attribute/tree/named',
	children: (CommentNode | IdentifierNode | StringNode | AttributeValueNode)[],
}
export const AttributeTreeNamedValuesNode = Object.freeze({
	destruct(node: AttributeTreeNamedValuesNode): {
		values: AttributeTreeNamedKeyValuePair[],
	} {
		const ans: { values: AttributeTreeNamedKeyValuePair[] } = {
			values: [],
		}
		let key: IdentifierNode | StringNode | undefined
		for (const child of node.children) {
			if (CommentNode.is(child)) {
				continue
			}

			if (IdentifierNode.is(child) || StringNode.is(child)) {
				key = child
			} else if (key) {
				ans.values.push({ key, value: child })
				key = undefined
			}
		}
		return ans
	},
	is(node: AstNode | undefined): node is AttributeTreeNamedValuesNode {
		return (node as AttributeTreeNamedValuesNode | undefined)?.type === 'mcdoc:attribute/tree/named'
	},
})
export interface AttributeTreeNamedKeyValuePair {
	key: IdentifierNode | StringNode,
	value: AttributeValueNode,
}

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

export interface IntRangeNode extends AstNode {
	type: 'mcdoc:int_range',
	children: (IntegerNode | LiteralNode)[],
}
export const IntRangeNode = Object.freeze({
	destruct(node: IntRangeNode): {
		kind: RangeKind,
		min?: IntegerNode,
		max?: IntegerNode,
	} {
		return destructRangeNode(node)
	},
	is(node: AstNode | undefined): node is IntRangeNode {
		return (node as IntRangeNode | undefined)?.type === 'mcdoc:int_range'
	},
})

export interface LiteralTypeNode extends TypeBaseNode<LiteralTypeValueNode> {
	type: 'mcdoc:type/literal',
}
export const LiteralTypeNode = Object.freeze({
	destruct(node: LiteralTypeNode): {
		value: LiteralTypeValueNode,
	} {
		return {
			value: node.children.find(LiteralTypeValueNode.is)!,
		}
	},
	is(node: AstNode | undefined): node is LiteralTypeNode {
		return (node as LiteralTypeNode | undefined)?.type === 'mcdoc:type/literal'
	},
})

export type LiteralTypeValueNode = LiteralNode | TypedNumberNode | StringNode
export const LiteralTypeValueNode = Object.freeze({
	is(node: AstNode | undefined): node is LiteralTypeValueNode {
		return LiteralNode.is(node) || TypedNumberNode.is(node) || StringNode.is(node)
	},
})

export interface TypedNumberNode extends AstNode {
	type: 'mcdoc:typed_number',
	children: (FloatNode | LiteralNode)[],
}
export const TypedNumberNode = Object.freeze({
	destruct(node: TypedNumberNode): {
		value: FloatNode,
		suffix?: LiteralNode,
	} {
		return {
			value: node.children.find(FloatNode.is)!,
			suffix: node.children.find(LiteralNode.is),
		}
	},
	is(node: AstNode | undefined): node is TypedNumberNode {
		return (node as TypedNumberNode | undefined)?.type === 'mcdoc:typed_number'
	},
})

export interface NumericTypeNode extends TypeBaseNode<LiteralNode | FloatRangeNode | IntRangeNode> {
	type: 'mcdoc:type/numeric_type'
}
export const NumericTypeNode = Object.freeze({
	destruct(node: NumericTypeNode): {
		numericKind: LiteralNode,
		valueRange?: FloatRangeNode | IntRangeNode,
	} {
		return {
			numericKind: node.children.find(LiteralNode.is)!,
			valueRange: node.children.find(FloatRangeNode.is) || node.children.find(IntRangeNode.is),
		}
	},
	is(node: AstNode | undefined): node is NumericTypeNode {
		return (node as NumericTypeNode | undefined)?.type === 'mcdoc:type/numeric_type'
	},
})

export const RangeExclusiveChar = '/'

/**
 * A 2-bit binary number is used to represent the kind of range.
 * The first bit from the left represents the start, the second bit from the left represents the end.
 * The bit is turned on if the range is exclusive on that end.
 */
export type RangeKind = 0b00 | 0b01 | 0b10 | 0b11

export function getRangeDelimiter(kind: RangeKind): string {
	const prefix = kind & 0b10 ? RangeExclusiveChar : ''
	const suffix = kind & 0b01 ? RangeExclusiveChar : ''
	return `${prefix}..${suffix}`
}

function destructRangeNode<N extends FloatRangeNode | IntRangeNode>(node: N): {
	kind: RangeKind,
	min?: N extends FloatRangeNode ? FloatNode : IntegerNode,
	max?: N extends FloatRangeNode ? FloatNode : IntegerNode,
} {
	let kind: RangeKind
	let min: (FloatNode & IntegerNode) | undefined
	let max: (FloatNode & IntegerNode) | undefined
	if (node.children.length === 1) {
		// a
		kind = 0b00
		min = max = node.children[0] as FloatNode & IntegerNode
	} else if (node.children.length === 3) {
		// a..b
		kind = getKind(node.children[1] as LiteralNode)
		min = node.children[0] as FloatNode & IntegerNode
		max = node.children[2] as FloatNode & IntegerNode
	} else if (LiteralNode.is(node.children[0])) {
		// ..b
		kind = getKind(node.children[0])
		max = node.children[1] as FloatNode & IntegerNode
	} else {
		// a..
		kind = getKind(node.children[1] as LiteralNode)
		min = node.children[0] as FloatNode & IntegerNode
	}
	return {
		kind,
		min,
		max,
	}

	function getKind(delimiter: LiteralNode): RangeKind {
		let ans: number = 0b00
		if (delimiter.value.startsWith(RangeExclusiveChar)) {
			ans |= 0b10
		}
		if (delimiter.value.endsWith(RangeExclusiveChar)) {
			ans |= 0b01
		}
		return ans as RangeKind
	}
}

export interface FloatRangeNode extends AstNode {
	type: 'mcdoc:float_range',
	children: (FloatNode | LiteralNode)[],
}
export const FloatRangeNode = Object.freeze({
	destruct(node: FloatRangeNode): {
		kind: RangeKind,
		min?: FloatNode,
		max?: FloatNode,
	} {
		return destructRangeNode(node)
	},
	is(node: AstNode | undefined): node is FloatRangeNode {
		return (node as FloatRangeNode | undefined)?.type === 'mcdoc:float_range'
	},
})

export interface PrimitiveArrayTypeNode extends TypeBaseNode<LiteralNode | IntRangeNode> {
	type: 'mcdoc:type/primitive_array',
}
export const PrimitiveArrayTypeNode = Object.freeze({
	destruct(node: PrimitiveArrayTypeNode): {
		arrayKind: LiteralNode,
		lengthRange?: IntRangeNode,
		valueRange?: IntRangeNode,
	} {
		let lengthRange: IntRangeNode | undefined
		let valueRange: IntRangeNode | undefined
		let afterBrackets = false
		for (const child of node.children) {
			if (LiteralNode.is(child) && child.value === '[]') {
				afterBrackets = true
			} else if (IntRangeNode.is(child)) {
				if (afterBrackets) {
					lengthRange = child
				} else {
					valueRange = child
				}
			}
		}
		return {
			arrayKind: node.children.find(LiteralNode.is)!,
			lengthRange,
			valueRange,
		}
	},
	is(node: AstNode | undefined): node is PrimitiveArrayTypeNode {
		return (node as PrimitiveArrayTypeNode | undefined)?.type === 'mcdoc:type/primitive_array'
	},
})

export interface ListTypeNode extends TypeBaseNode<TypeNode | IntRangeNode> {
	type: 'mcdoc:type/list',
}
export const ListTypeNode = Object.freeze({
	destruct(node: ListTypeNode): {
		item: TypeNode,
		lengthRange?: IntRangeNode,
	} {
		return {
			item: node.children.find(TypeNode.is)!,
			lengthRange: node.children.find(IntRangeNode.is),
		}
	},
	is(node: AstNode | undefined): node is ListTypeNode {
		return (node as ListTypeNode | undefined)?.type === 'mcdoc:type/list'
	},
})

export interface StringTypeNode extends TypeBaseNode<LiteralNode | IntRangeNode> {
	type: 'mcdoc:type/string',
}
export const StringTypeNode = Object.freeze({
	destruct(node: StringTypeNode): {
		lengthRange?: IntRangeNode,
	} {
		return {
			lengthRange: node.children.find(IntRangeNode.is),
		}
	},
	is(node: AstNode | undefined): node is StringTypeNode {
		return (node as StringTypeNode | undefined)?.type === 'mcdoc:type/string'
	},
})

export interface TupleTypeNode extends TypeBaseNode<TypeNode> {
	type: 'mcdoc:type/tuple',
}
export const TupleTypeNode = Object.freeze({
	destruct(node: TupleTypeNode): {
		items: TypeNode[],
	} {
		return {
			items: node.children.filter(TypeNode.is),
		}
	},
	is(node: AstNode | undefined): node is TupleTypeNode {
		return (node as TupleTypeNode | undefined)?.type === 'mcdoc:type/tuple'
	},
})

export interface EnumNode extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | EnumBlockNode> {
	type: 'mcdoc:enum',
}
const EnumKinds = new Set(['byte', 'short', 'int', 'long', 'float', 'double', 'string'] as const)
export type EnumKind = typeof EnumKinds extends Set<infer V> ? V : never
export const EnumNode = Object.freeze({
	kinds: EnumKinds,
	destruct(node: EnumNode): {
		block: EnumBlockNode,
		docComments?: DocCommentsNode,
		enumKind?: EnumKind,
		identifier?: IdentifierNode,
	} {
		return {
			block: node.children.find(EnumBlockNode.is)!,
			docComments: node.children.find(DocCommentsNode.is),
			enumKind: getEnumKind(node),
			identifier: node.children.find(IdentifierNode.is),
		}

		function getEnumKind(node: EnumNode): EnumKind | undefined {
			for (const literal of node.children.filter(LiteralNode.is)) {
				if (EnumKinds.has(literal.value as EnumKind)) {
					return literal.value as EnumKind
				}
			}
			return undefined
		}
	},
	is(node: AstNode | undefined): node is EnumNode {
		return (node as EnumNode | undefined)?.type === 'mcdoc:enum'
	},
})

export interface DocCommentsNode extends AstNode {
	type: 'mcdoc:doc_comments',
	children: CommentNode[],
}
export const DocCommentsNode = Object.freeze({
	/**
	 * @returns The text content of this doc comment block.
	 */
	asText(node: DocCommentsNode | undefined): string | undefined {
		if (!node) {
			return undefined
		}

		let comments = node.children.map(doc => doc.comment)

		// If every comment contains a leading space or is empty, stripe the leading spaces off.
		// e.g. /// This is an example doc comment.
		//      ///
		//      /// Another line.
		// should be converted to "This is an example doc comment.\n\nAnother line."
		if (comments.every(s => s.length === 0 || s.startsWith(' '))) {
			comments = comments.map(s => s.slice(1))
		}

		return comments.join('\n')
	},
	is(node: AstNode | undefined): node is DocCommentsNode {
		return (node as DocCommentsNode | undefined)?.type === 'mcdoc:doc_comments'
	},
})

export interface EnumBlockNode extends AstNode {
	type: 'mcdoc:enum/block',
	children: (CommentNode | EnumFieldNode)[],
}
export const EnumBlockNode = Object.freeze({
	destruct(node: EnumBlockNode): {
		fields: EnumFieldNode[],
	} {
		return {
			fields: node.children.filter(EnumFieldNode.is),
		}
	},
	is(node: AstNode | undefined): node is EnumBlockNode {
		return (node as EnumBlockNode | undefined)?.type === 'mcdoc:enum/block'
	},
})

export interface EnumFieldNode extends AstNode {
	type: 'mcdoc:enum/field',
	children: (CommentNode | PrelimNode | IdentifierNode | EnumValueNode)[],
}
export const EnumFieldNode = Object.freeze({
	destruct(node: EnumFieldNode): {
		attributes: AttributeNode[],
		identifier: IdentifierNode,
		value: EnumValueNode,
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			identifier: node.children.find(IdentifierNode.is)!,
			value: node.children.find(EnumValueNode.is)!,
		}
	},
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

export interface StructNode extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | StructBlockNode> {
	type: 'mcdoc:struct',
}
export const StructNode = Object.freeze({
	destruct(node: StructNode): {
		block: StructBlockNode,
		docComments?: DocCommentsNode,
		identifier?: IdentifierNode,
	} {
		return {
			block: node.children.find(StructBlockNode.is)!,
			docComments: node.children.find(DocCommentsNode.is),
			identifier: node.children.find(IdentifierNode.is),
		}
	},
	is(node: AstNode | undefined): node is StructNode {
		return (node as StructNode | undefined)?.type === 'mcdoc:struct'
	},
})

export interface ReferenceTypeNode extends TypeBaseNode<PathNode | TypeNode> {
	type: 'mcdoc:type/reference',
}
export const ReferenceTypeNode = Object.freeze({
	destruct(node: ReferenceTypeNode): {
		path: PathNode,
		typeParameters: TypeNode[],
	} {
		return {
			path: node.children.find(PathNode.is)!,
			typeParameters: node.children.filter(TypeNode.is),
		}
	},
	is(node: AstNode | undefined): node is ReferenceTypeNode {
		return (node as ReferenceTypeNode | undefined)?.type === 'mcdoc:type/reference'
	},
})

export interface TypeParamBlockNode extends AstNode {
	type: 'mcdoc:type_param_block',
	children: (CommentNode | TypeParamNode)[],
}
export const TypeParamBlockNode = Object.freeze({
	destruct(node: TypeParamBlockNode): {
		params: TypeParamNode[],
	} {
		return {
			params: node.children.filter(TypeParamNode.is),
		}
	},
	is(node: AstNode | undefined): node is TypeParamBlockNode {
		return (node as TypeParamBlockNode | undefined)?.type === 'mcdoc:type_param_block'
	},
})

export interface TypeParamNode extends AstNode {
	type: 'mcdoc:type_param',
	children: (CommentNode | IdentifierNode | LiteralNode | PathNode)[],
}
export const TypeParamNode = Object.freeze({
	destruct(node: TypeParamNode): {
		constraint?: PathNode,
		identifier: IdentifierNode,
	} {
		return {
			constraint: node.children.find(PathNode.is),
			identifier: node.children.find(IdentifierNode.is)!,
		}
	},
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
	destruct(node: PathNode | undefined): {
		children: (LiteralNode | IdentifierNode)[],
		isAbsolute?: boolean,
		lastIdentifier?: IdentifierNode,
	} {
		const lastChild = atArray(node?.children, -1)
		return {
			children: node?.children ?? [],
			isAbsolute: node?.isAbsolute,
			lastIdentifier: IdentifierNode.is(lastChild) ? lastChild : undefined,
		}
	},
	is(node: AstNode | undefined): node is PathNode {
		return (node as PathNode | undefined)?.type === 'mcdoc:path'
	},
})

export interface StructBlockNode extends AstNode {
	type: 'mcdoc:struct/block',
	children: (CommentNode | StructFieldNode)[],
}
export const StructBlockNode = Object.freeze({
	destruct(node: StructBlockNode): {
		fields: StructFieldNode[],
	} {
		return {
			fields: node.children.filter(StructFieldNode.is),
		}
	},
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
	destruct(node: StructPairFieldNode): {
		attributes: AttributeNode[],
		key: StructKeyNode,
		type: TypeNode,
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			key: node.children.find(StructKeyNode.is)!,
			type: node.children.find(TypeNode.is)!,
		}
	},
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
	destruct(node: StructMapKeyNode): {
		type: TypeNode,
	} {
		return {
			type: node.children.find(TypeNode.is)!,
		}
	},
	is(node: AstNode | undefined): node is StructMapKeyNode {
		return (node as StructMapKeyNode | undefined)?.type === 'mcdoc:struct/map_key'
	},
})

export interface StructSpreadFieldNode extends AstNode {
	type: 'mcdoc:struct/field/spread',
	children: (CommentNode | AttributeNode | TypeNode)[],
}
export const StructSpreadFieldNode = Object.freeze({
	destruct(node: StructSpreadFieldNode): {
		attributes: AttributeNode[],
		type: TypeNode,
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			type: node.children.find(TypeNode.is)!,
		}
	},
	is(node: AstNode | undefined): node is StructSpreadFieldNode {
		return (node as StructSpreadFieldNode | undefined)?.type === 'mcdoc:struct/field/spread'
	},
})

export interface DispatcherTypeNode extends TypeBaseNode<ResourceLocationNode | IndexBodyNode> {
	type: 'mcdoc:type/dispatcher',
}
export const DispatcherTypeNode = Object.freeze({
	destruct(node: DispatcherTypeNode): {
		location: ResourceLocationNode,
		index: IndexBodyNode,
	} {
		return {
			location: node.children.find(ResourceLocationNode.is)!,
			index: node.children.find(IndexBodyNode.is)!,
		}
	},
	is(node: AstNode | undefined): node is DispatcherTypeNode {
		return (node as DispatcherTypeNode | undefined)?.type === 'mcdoc:type/dispatcher'
	},
})

export interface UnionTypeNode extends TypeBaseNode<TypeNode> {
	type: 'mcdoc:type/union',
}
export const UnionTypeNode = Object.freeze({
	destruct(node: UnionTypeNode): {
		members: TypeNode[],
	} {
		return {
			members: node.children.filter(TypeNode.is),
		}
	},
	is(node: AstNode | undefined): node is UnionTypeNode {
		return (node as UnionTypeNode | undefined)?.type === 'mcdoc:type/union'
	},
})

export interface InjectionNode extends AstNode {
	type: 'mcdoc:injection',
	children: (CommentNode | LiteralNode | InjectionContentNode)[]
}
export const InjectionNode = Object.freeze({
	destruct(node: InjectionNode): {
		injection: InjectionContentNode,
	} {
		return {
			injection: node.children.find(InjectionContentNode.is)!,
		}
	},
	is(node: AstNode | undefined): node is InjectionNode {
		return (node as InjectionNode | undefined)?.type === 'mcdoc:injection'
	},
})

export type InjectionContentNode = EnumInjectionNode | StructInjectionNode
export const InjectionContentNode = Object.freeze({
	is(node: AstNode | undefined): node is InjectionContentNode {
		return EnumInjectionNode.is(node) || StructInjectionNode.is(node)
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
	children: (CommentNode | LiteralNode | PathNode | StructBlockNode)[],
}
export const StructInjectionNode = Object.freeze({
	is(node: AstNode | undefined): node is StructInjectionNode {
		return (node as StructInjectionNode | undefined)?.type === 'mcdoc:injection/struct'
	},
})

export interface TypeAliasNode extends AstNode {
	type: 'mcdoc:type_alias',
	children: (CommentNode | DocCommentsNode | LiteralNode | IdentifierNode | TypeParamBlockNode | TypeNode)[],
}
export const TypeAliasNode = Object.freeze({
	destruct(node: TypeAliasNode): {
		docComments?: DocCommentsNode,
		identifier?: IdentifierNode,
		typeParams?: TypeParamBlockNode,
		rhs?: TypeNode,
	} {
		return {
			docComments: node.children.find(DocCommentsNode.is),
			identifier: node.children.find(IdentifierNode.is),
			typeParams: node.children.find(TypeParamBlockNode.is),
			rhs: node.children.find(TypeNode.is),
		}
	},
	is(node: AstNode | undefined): node is TypeAliasNode {
		return (node as TypeAliasNode | undefined)?.type === 'mcdoc:type_alias'
	},
})

export interface UseStatementNode extends AstNode {
	type: 'mcdoc:use_statement',
	children: (CommentNode | LiteralNode | PathNode | IdentifierNode)[]
}
export const UseStatementNode = Object.freeze({
	destruct(node: UseStatementNode): {
		binding?: IdentifierNode,
		path?: PathNode,
	} {
		return {
			binding: node.children.find(IdentifierNode.is),
			path: node.children.find(PathNode.is),
		}
	},
	is(node: AstNode | undefined): node is UseStatementNode {
		return (node as UseStatementNode | undefined)?.type === 'mcdoc:use_statement'
	},
})
