import type { AstNode, ColorTokenType, SymbolBaseNode } from '@spyglassmc/core'
import {
	atArray,
	CommentNode,
	FloatNode,
	IntegerNode,
	LongNode,
	ResourceLocationNode,
	StringNode,
} from '@spyglassmc/core'

export interface ModuleNode extends AstNode {
	type: 'mcdoc:module'
	children: TopLevelNode[]
}
export namespace ModuleNode {
	export function is(node: AstNode | undefined): node is ModuleNode {
		return (node as ModuleNode | undefined)?.type === 'mcdoc:module'
	}
}

export type TopLevelNode =
	| CommentNode
	| DispatchStatementNode
	| EnumNode
	| InjectionNode
	| StructNode
	| TypeAliasNode
	| UseStatementNode
export namespace TopLevelNode {
	export function is(node: AstNode | undefined): node is TopLevelNode {
		return (CommentNode.is(node)
			|| DispatchStatementNode.is(node)
			|| EnumNode.is(node)
			|| InjectionNode.is(node)
			|| StructNode.is(node)
			|| TypeAliasNode.is(node)
			|| UseStatementNode.is(node))
	}
}

export interface DispatchStatementNode extends AstNode {
	type: 'mcdoc:dispatch_statement'
	children: (
		| CommentNode
		| PrelimNode
		| LiteralNode
		| ResourceLocationNode
		| IndexBodyNode
		| TypeParamBlockNode
		| TypeNode
	)[]
}
export namespace DispatchStatementNode {
	export function destruct(
		node: DispatchStatementNode,
	): {
		attributes: AttributeNode[]
		location?: ResourceLocationNode
		index?: IndexBodyNode
		target?: TypeNode
		typeParams?: TypeParamBlockNode
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			location: node.children.find(ResourceLocationNode.is),
			index: node.children.find(IndexBodyNode.is),
			target: node.children.find(TypeNode.is),
			typeParams: node.children.find(TypeParamBlockNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is DispatchStatementNode {
		return ((node as DispatchStatementNode | undefined)?.type === 'mcdoc:dispatch_statement')
	}
}

export interface LiteralNode extends AstNode {
	type: 'mcdoc:literal'
	value: string
	colorTokenType?: ColorTokenType
}
export namespace LiteralNode {
	export function is(node: AstNode | undefined): node is LiteralNode {
		return (node as LiteralNode | undefined)?.type === 'mcdoc:literal'
	}
}

export interface IndexBodyNode extends AstNode {
	type: 'mcdoc:index_body'
	children: (CommentNode | IndexNode)[]
}
export namespace IndexBodyNode {
	export function destruct(node: IndexBodyNode): { parallelIndices: IndexNode[] } {
		return { parallelIndices: node.children.filter(IndexNode.is) }
	}
	export function is(node: AstNode | undefined): node is IndexBodyNode {
		return (node as IndexBodyNode | undefined)?.type === 'mcdoc:index_body'
	}
}

export type IndexNode = StaticIndexNode | DynamicIndexNode
export namespace IndexNode {
	export function is(node: AstNode | undefined): node is IndexNode {
		return StaticIndexNode.is(node) || DynamicIndexNode.is(node)
	}
}

export type StaticIndexNode = LiteralNode | IdentifierNode | StringNode | ResourceLocationNode
export namespace StaticIndexNode {
	export function is(node: AstNode | undefined): node is StaticIndexNode {
		return (LiteralNode.is(node)
			|| IdentifierNode.is(node)
			|| StringNode.is(node)
			|| ResourceLocationNode.is(node))
	}
}

export interface IdentifierNode extends SymbolBaseNode {
	type: 'mcdoc:identifier'
}
export namespace IdentifierNode {
	export function is(node: AstNode | undefined): node is IdentifierNode {
		return (node as IdentifierNode | undefined)?.type === 'mcdoc:identifier'
	}
}

export interface DynamicIndexNode extends AstNode {
	type: 'mcdoc:dynamic_index'
	children: (CommentNode | AccessorKeyNode)[]
}
export namespace DynamicIndexNode {
	export function destruct(node: DynamicIndexNode): { keys: AccessorKeyNode[] } {
		return { keys: node.children.filter(AccessorKeyNode.is) }
	}
	export function is(node: AstNode | undefined): node is DynamicIndexNode {
		return ((node as DynamicIndexNode | undefined)?.type === 'mcdoc:dynamic_index')
	}
}

export type AccessorKeyNode = LiteralNode | IdentifierNode | StringNode
export namespace AccessorKeyNode {
	export function is(node: AstNode | undefined): node is AccessorKeyNode {
		return (LiteralNode.is(node) || IdentifierNode.is(node) || StringNode.is(node))
	}
}

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
export namespace TypeNode {
	export function is(node: AstNode | undefined): node is TypeNode {
		return (AnyTypeNode.is(node)
			|| BooleanTypeNode.is(node)
			|| StringTypeNode.is(node)
			|| LiteralTypeNode.is(node)
			|| NumericTypeNode.is(node)
			|| PrimitiveArrayTypeNode.is(node)
			|| ListTypeNode.is(node)
			|| TupleTypeNode.is(node)
			|| EnumNode.is(node)
			|| StructNode.is(node)
			|| ReferenceTypeNode.is(node)
			|| DispatcherTypeNode.is(node)
			|| UnionTypeNode.is(node))
	}
}

export interface TypeBaseNode<CN extends AstNode> extends AstNode {
	type: `mcdoc:${string}`
	children: (CommentNode | AttributeNode | IndexBodyNode | TypeArgBlockNode | CN)[]
}
export namespace TypeBaseNode {
	export function destruct(
		node: TypeBaseNode<any>,
	): { appendixes: (IndexBodyNode | TypeArgBlockNode)[]; attributes: AttributeNode[] } {
		return {
			appendixes: node.children.filter((n): n is IndexBodyNode | TypeArgBlockNode =>
				IndexBodyNode.is(n) || TypeArgBlockNode.is(n)
			),
			attributes: node.children.filter(AttributeNode.is),
		}
	}
}

export interface AttributeNode extends AstNode {
	type: 'mcdoc:attribute'
	children: (CommentNode | IdentifierNode | AttributeValueNode)[]
}
export namespace AttributeNode {
	export function destruct(
		node: AttributeNode,
	): { name: IdentifierNode; value: AttributeValueNode | undefined } {
		return {
			name: node.children.find(IdentifierNode.is)!,
			value: node.children.find(AttributeValueNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is AttributeNode {
		return (node as AttributeNode | undefined)?.type === 'mcdoc:attribute'
	}
}

export type AttributeValueNode = TypeNode | AttributeTreeNode
export namespace AttributeValueNode {
	export function is(node: AstNode | undefined): node is AttributeValueNode {
		return TypeNode.is(node) || AttributeTreeNode.is(node)
	}
}

export interface AttributeTreeNode extends AstNode {
	type: 'mcdoc:attribute/tree'
	children: (CommentNode | AttributeTreePosValuesNode | AttributeTreeNamedValuesNode)[]
	delim: '(' | '[' | '{'
}
export namespace AttributeTreeNode {
	export function destruct(
		node: AttributeTreeNode,
	): { positional?: AttributeTreePosValuesNode; named?: AttributeTreeNamedValuesNode } {
		return {
			positional: node.children.find(AttributeTreePosValuesNode.is),
			named: node.children.find(AttributeTreeNamedValuesNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is AttributeTreeNode {
		return ((node as AttributeTreeNode | undefined)?.type === 'mcdoc:attribute/tree')
	}
}

export interface AttributeTreePosValuesNode extends AstNode {
	type: 'mcdoc:attribute/tree/pos'
	children: (CommentNode | AttributeValueNode)[]
}
export namespace AttributeTreePosValuesNode {
	export function destruct(node: AttributeTreePosValuesNode): { values: AttributeValueNode[] } {
		return { values: node.children.filter(AttributeValueNode.is) }
	}
	export function is(node: AstNode | undefined): node is AttributeTreePosValuesNode {
		return ((node as AttributeTreePosValuesNode | undefined)?.type === 'mcdoc:attribute/tree/pos')
	}
}

export interface AttributeTreeNamedValuesNode extends AstNode {
	type: 'mcdoc:attribute/tree/named'
	children: (CommentNode | IdentifierNode | StringNode | AttributeValueNode)[]
}
export namespace AttributeTreeNamedValuesNode {
	export function destruct(
		node: AttributeTreeNamedValuesNode,
	): { values: AttributeTreeNamedKeyValuePair[] } {
		const ans: { values: AttributeTreeNamedKeyValuePair[] } = { values: [] }
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
	}
	export function is(node: AstNode | undefined): node is AttributeTreeNamedValuesNode {
		return ((node as AttributeTreeNamedValuesNode | undefined)?.type
			=== 'mcdoc:attribute/tree/named')
	}
}
export interface AttributeTreeNamedKeyValuePair {
	key: IdentifierNode | StringNode
	value: AttributeValueNode
}

export interface TypeArgBlockNode extends AstNode {
	type: 'mcdoc:type_arg_block'
	children: (CommentNode | TypeNode)[]
}
export namespace TypeArgBlockNode {
	export function destruct(node: TypeArgBlockNode): { args: TypeNode[] } {
		return { args: node.children.filter(TypeNode.is) }
	}
	export function is(node: AstNode | undefined): node is TypeArgBlockNode {
		return ((node as TypeArgBlockNode | undefined)?.type === 'mcdoc:type_arg_block')
	}
}

export interface AnyTypeNode extends TypeBaseNode<LiteralNode> {
	type: 'mcdoc:type/any'
}
export namespace AnyTypeNode {
	export function is(node: AstNode | undefined): node is AnyTypeNode {
		return (node as AnyTypeNode | undefined)?.type === 'mcdoc:type/any'
	}
}

export interface BooleanTypeNode extends TypeBaseNode<LiteralNode> {
	type: 'mcdoc:type/boolean'
}
export namespace BooleanTypeNode {
	export function is(node: AstNode | undefined): node is BooleanTypeNode {
		return (node as BooleanTypeNode | undefined)?.type === 'mcdoc:type/boolean'
	}
}

export interface IntRangeNode extends AstNode {
	type: 'mcdoc:int_range'
	children: (IntegerNode | LiteralNode)[]
}
export namespace IntRangeNode {
	export function destruct(
		node: IntRangeNode,
	): { kind: RangeKind; min?: IntegerNode; max?: IntegerNode } {
		return destructRangeNode(node)
	}
	export function is(node: AstNode | undefined): node is IntRangeNode {
		return (node as IntRangeNode | undefined)?.type === 'mcdoc:int_range'
	}
}

export interface LongRangeNode extends AstNode {
	type: 'mcdoc:long_range'
	children: (LongNode | LiteralNode)[]
}
export namespace LongRangeNode {
	export function destruct(
		node: LongRangeNode,
	): { kind: RangeKind; min?: LongNode; max?: LongNode } {
		return destructRangeNode(node)
	}
	export function is(node: AstNode | undefined): node is LongRangeNode {
		return (node as LongRangeNode | undefined)?.type === 'mcdoc:long_range'
	}
}

export interface LiteralTypeNode extends TypeBaseNode<LiteralTypeValueNode> {
	type: 'mcdoc:type/literal'
}
export namespace LiteralTypeNode {
	export function destruct(node: LiteralTypeNode): { value: LiteralTypeValueNode } {
		return { value: node.children.find(LiteralTypeValueNode.is)! }
	}
	export function is(node: AstNode | undefined): node is LiteralTypeNode {
		return (node as LiteralTypeNode | undefined)?.type === 'mcdoc:type/literal'
	}
}

export type LiteralTypeValueNode = LiteralNode | TypedNumberNode | StringNode
export namespace LiteralTypeValueNode {
	export function is(node: AstNode | undefined): node is LiteralTypeValueNode {
		return (LiteralNode.is(node) || TypedNumberNode.is(node) || StringNode.is(node))
	}
}

export interface TypedNumberNode extends AstNode {
	type: 'mcdoc:typed_number'
	children: (FloatNode | IntegerNode | LongNode | LiteralNode)[]
}
export namespace TypedNumberNode {
	export function destruct(
		node: TypedNumberNode,
	): { value: FloatNode | IntegerNode | LongNode; suffix?: LiteralNode } {
		return {
			value: node.children.find(FloatNode.is)
				?? node.children.find(IntegerNode.is)
				?? node.children.find(LongNode.is)!,
			suffix: node.children.find(LiteralNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is TypedNumberNode {
		return (node as TypedNumberNode | undefined)?.type === 'mcdoc:typed_number'
	}
}

export interface NumericTypeNode
	extends TypeBaseNode<LiteralNode | FloatRangeNode | IntRangeNode | LongRangeNode>
{
	type: 'mcdoc:type/numeric_type'
}
export namespace NumericTypeNode {
	export function destruct(
		node: NumericTypeNode,
	): { numericKind: LiteralNode; valueRange?: FloatRangeNode | IntRangeNode | LongRangeNode } {
		return {
			numericKind: node.children.find(LiteralNode.is)!,
			valueRange: node.children.find(FloatRangeNode.is)
				|| node.children.find(IntRangeNode.is)
				|| node.children.find(LongRangeNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is NumericTypeNode {
		return ((node as NumericTypeNode | undefined)?.type === 'mcdoc:type/numeric_type')
	}
}

export const RangeExclusiveChar = '<'

/**
 * A 2-bit binary number is used to represent the kind of range.
 * The first bit from the left represents the start, the second bit from the left represents the end.
 * The bit is turned on if the range is exclusive on that end.
 */
export type RangeKind = 0b00 | 0b01 | 0b10 | 0b11
export namespace RangeKind {
	export function isLeftExclusive(rangeKind: RangeKind): boolean {
		return (rangeKind & 0b10) !== 0
	}
	export function isRightExclusive(rangeKind: RangeKind): boolean {
		return (rangeKind & 0b01) !== 0
	}
}

export function getRangeDelimiter(kind: RangeKind): string {
	const prefix = kind & 0b10 ? RangeExclusiveChar : ''
	const suffix = kind & 0b01 ? RangeExclusiveChar : ''
	return `${prefix}..${suffix}`
}

function destructRangeNode<N extends FloatRangeNode | IntRangeNode | LongRangeNode>(
	node: N,
): {
	kind: RangeKind
	min?: N extends IntRangeNode ? IntegerNode : N extends LongRangeNode ? LongNode : FloatNode
	max?: N extends IntRangeNode ? IntegerNode : N extends LongRangeNode ? LongNode : FloatNode
} {
	let kind: RangeKind
	let min: (FloatNode & IntegerNode & LongNode) | undefined
	let max: (FloatNode & IntegerNode & LongNode) | undefined
	if (node.children.length === 1) {
		// a
		kind = 0b00
		min = max = node.children[0] as FloatNode & IntegerNode & LongNode
	} else if (node.children.length === 3) {
		// a..b
		kind = getKind(node.children[1] as LiteralNode)
		min = node.children[0] as FloatNode & IntegerNode & LongNode
		max = node.children[2] as FloatNode & IntegerNode & LongNode
	} else if (LiteralNode.is(node.children[0])) {
		// ..b
		kind = getKind(node.children[0])
		max = node.children[1] as FloatNode & IntegerNode & LongNode
	} else {
		// a..
		kind = getKind(node.children[1] as LiteralNode)
		min = node.children[0] as FloatNode & IntegerNode & LongNode
	}
	return { kind, min, max }

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
	type: 'mcdoc:float_range'
	children: (FloatNode | LiteralNode)[]
}
export namespace FloatRangeNode {
	export function destruct(
		node: FloatRangeNode,
	): { kind: RangeKind; min?: FloatNode; max?: FloatNode } {
		return destructRangeNode(node)
	}
	export function is(node: AstNode | undefined): node is FloatRangeNode {
		return (node as FloatRangeNode | undefined)?.type === 'mcdoc:float_range'
	}
}

export interface PrimitiveArrayTypeNode
	extends TypeBaseNode<LiteralNode | IntRangeNode | LongRangeNode>
{
	type: 'mcdoc:type/primitive_array'
}
export namespace PrimitiveArrayTypeNode {
	export function destruct(
		node: PrimitiveArrayTypeNode,
	): {
		arrayKind: LiteralNode
		lengthRange?: IntRangeNode
		valueRange?: IntRangeNode | LongRangeNode
	} {
		let lengthRange: IntRangeNode | undefined
		let valueRange: IntRangeNode | LongRangeNode | undefined
		let afterBrackets = false
		for (const child of node.children) {
			if (LiteralNode.is(child) && child.value === '[]') {
				afterBrackets = true
			} else if (LongRangeNode.is(child)) {
				valueRange = child
			} else if (IntRangeNode.is(child)) {
				if (afterBrackets) {
					lengthRange = child
				} else {
					valueRange = child
				}
			}
		}
		return { arrayKind: node.children.find(LiteralNode.is)!, lengthRange, valueRange }
	}
	export function is(node: AstNode | undefined): node is PrimitiveArrayTypeNode {
		return ((node as PrimitiveArrayTypeNode | undefined)?.type === 'mcdoc:type/primitive_array')
	}
}

export interface ListTypeNode extends TypeBaseNode<TypeNode | IntRangeNode> {
	type: 'mcdoc:type/list'
}
export namespace ListTypeNode {
	export function destruct(node: ListTypeNode): { item: TypeNode; lengthRange?: IntRangeNode } {
		return {
			item: node.children.find(TypeNode.is)!,
			lengthRange: node.children.find(IntRangeNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is ListTypeNode {
		return (node as ListTypeNode | undefined)?.type === 'mcdoc:type/list'
	}
}

export interface StringTypeNode extends TypeBaseNode<LiteralNode | IntRangeNode> {
	type: 'mcdoc:type/string'
}
export namespace StringTypeNode {
	export function destruct(node: StringTypeNode): { lengthRange?: IntRangeNode } {
		return { lengthRange: node.children.find(IntRangeNode.is) }
	}
	export function is(node: AstNode | undefined): node is StringTypeNode {
		return (node as StringTypeNode | undefined)?.type === 'mcdoc:type/string'
	}
}

export interface TupleTypeNode extends TypeBaseNode<TypeNode> {
	type: 'mcdoc:type/tuple'
}
export namespace TupleTypeNode {
	export function destruct(node: TupleTypeNode): { items: TypeNode[] } {
		return { items: node.children.filter(TypeNode.is) }
	}
	export function is(node: AstNode | undefined): node is TupleTypeNode {
		return (node as TupleTypeNode | undefined)?.type === 'mcdoc:type/tuple'
	}
}

export interface EnumNode
	extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | EnumBlockNode>
{
	type: 'mcdoc:enum'
}
export type EnumKind = typeof EnumNode.Kinds extends Set<infer V> ? V : never
export namespace EnumNode {
	export const Kinds = new Set(
		['byte', 'short', 'int', 'long', 'float', 'double', 'string'] as const,
	)
	export function destruct(
		node: EnumNode,
	): {
		block: EnumBlockNode
		docComments?: DocCommentsNode
		enumKind?: EnumKind
		identifier?: IdentifierNode
		keyword: LiteralNode
	} {
		return {
			block: node.children.find(EnumBlockNode.is)!,
			docComments: node.children.find(DocCommentsNode.is),
			enumKind: getEnumKind(node),
			identifier: node.children.find(IdentifierNode.is),
			keyword: node.children.find(LiteralNode.is)!,
		}

		function getEnumKind(node: EnumNode): EnumKind | undefined {
			for (const literal of node.children.filter(LiteralNode.is)) {
				if (EnumNode.Kinds.has(literal.value as EnumKind)) {
					return literal.value as EnumKind
				}
			}
			return undefined
		}
	}
	export function is(node: AstNode | undefined): node is EnumNode {
		return (node as EnumNode | undefined)?.type === 'mcdoc:enum'
	}
}

export interface DocCommentsNode extends AstNode {
	type: 'mcdoc:doc_comments'
	children: CommentNode[]
}
export namespace DocCommentsNode {
	/**
	 * @returns The text content of this doc comment block.
	 */
	export function asText(node: DocCommentsNode | undefined): string | undefined {
		if (!node) {
			return undefined
		}

		let comments = node.children.map((doc) => doc.comment)

		// If every comment contains a leading space or is empty, stripe the leading spaces off.
		// e.g. /// This is an example doc comment.
		//      ///
		//      /// Another line.
		// should be converted to "This is an example doc comment.\n\nAnother line."
		if (comments.every((s) => s.length === 0 || s.startsWith(' '))) {
			comments = comments.map((s) => s.slice(1))
		}

		return comments.join('\n')
	}
	export function is(node: AstNode | undefined): node is DocCommentsNode {
		return (node as DocCommentsNode | undefined)?.type === 'mcdoc:doc_comments'
	}
}

export interface EnumBlockNode extends AstNode {
	type: 'mcdoc:enum/block'
	children: (CommentNode | EnumFieldNode)[]
}
export namespace EnumBlockNode {
	export function destruct(node: EnumBlockNode): { fields: EnumFieldNode[] } {
		return { fields: node.children.filter(EnumFieldNode.is) }
	}
	export function is(node: AstNode | undefined): node is EnumBlockNode {
		return (node as EnumBlockNode | undefined)?.type === 'mcdoc:enum/block'
	}
}

export interface EnumFieldNode extends AstNode {
	type: 'mcdoc:enum/field'
	children: (CommentNode | PrelimNode | IdentifierNode | EnumValueNode)[]
}
export namespace EnumFieldNode {
	export function destruct(
		node: EnumFieldNode,
	): {
		attributes: AttributeNode[]
		docComments?: DocCommentsNode
		identifier: IdentifierNode
		value: EnumValueNode
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			docComments: node.children.find(DocCommentsNode.is),
			identifier: node.children.find(IdentifierNode.is)!,
			value: node.children.find(EnumValueNode.is)!,
		}
	}
	export function is(node: AstNode | undefined): node is EnumFieldNode {
		return (node as EnumFieldNode | undefined)?.type === 'mcdoc:enum/field'
	}
}

export type EnumValueNode = TypedNumberNode | StringNode
export namespace EnumValueNode {
	export function is(node: AstNode | undefined): node is EnumValueNode {
		return TypedNumberNode.is(node) || StringNode.is(node)
	}
}

export type PrelimNode = AttributeNode | DocCommentsNode
export namespace PrelimNode {
	export function is(node: AstNode | undefined): node is PrelimNode {
		return AttributeNode.is(node) || DocCommentsNode.is(node)
	}
}

export interface StructNode
	extends TypeBaseNode<DocCommentsNode | LiteralNode | IdentifierNode | StructBlockNode>
{
	type: 'mcdoc:struct'
}
export namespace StructNode {
	export function destruct(
		node: StructNode,
	): {
		block: StructBlockNode
		docComments?: DocCommentsNode
		identifier?: IdentifierNode
		keyword: LiteralNode
	} {
		return {
			block: node.children.find(StructBlockNode.is)!,
			docComments: node.children.find(DocCommentsNode.is),
			identifier: node.children.find(IdentifierNode.is),
			keyword: node.children.find(LiteralNode.is)!,
		}
	}
	export function is(node: AstNode | undefined): node is StructNode {
		return (node as StructNode | undefined)?.type === 'mcdoc:struct'
	}
}

export interface ReferenceTypeNode extends TypeBaseNode<PathNode> {
	type: 'mcdoc:type/reference'
}
export namespace ReferenceTypeNode {
	export function destruct(node: ReferenceTypeNode): { path: PathNode } {
		return { path: node.children.find(PathNode.is)! }
	}
	export function is(node: AstNode | undefined): node is ReferenceTypeNode {
		return ((node as ReferenceTypeNode | undefined)?.type === 'mcdoc:type/reference')
	}
}

export interface TypeParamBlockNode extends AstNode {
	type: 'mcdoc:type_param_block'
	children: (CommentNode | TypeParamNode)[]
}
export namespace TypeParamBlockNode {
	export function destruct(node: TypeParamBlockNode): { params: TypeParamNode[] } {
		return { params: node.children.filter(TypeParamNode.is) }
	}
	export function is(node: AstNode | undefined): node is TypeParamBlockNode {
		return ((node as TypeParamBlockNode | undefined)?.type === 'mcdoc:type_param_block')
	}
}

export interface TypeParamNode extends AstNode {
	type: 'mcdoc:type_param'
	children: (CommentNode | IdentifierNode | LiteralNode)[]
}
export namespace TypeParamNode {
	export function destruct(node: TypeParamNode): {
		// constraint?: TypeNode,
		identifier: IdentifierNode
	} {
		return {
			// constraint: node.children.find(TypeNode.is),
			identifier: node.children.find(IdentifierNode.is)!,
		}
	}
	export function is(node: AstNode | undefined): node is TypeParamNode {
		return (node as TypeParamNode | undefined)?.type === 'mcdoc:type_param'
	}
}

export interface PathNode extends AstNode {
	type: 'mcdoc:path'
	children: (LiteralNode | IdentifierNode)[]
	isAbsolute?: boolean
}
export namespace PathNode {
	export function destruct(
		node: PathNode | undefined,
	): {
		children: (LiteralNode | IdentifierNode)[]
		isAbsolute?: boolean
		lastIdentifier?: IdentifierNode
	} {
		const lastChild = atArray(node?.children, -1)
		return {
			children: node?.children ?? [],
			isAbsolute: node?.isAbsolute,
			lastIdentifier: IdentifierNode.is(lastChild) ? lastChild : undefined,
		}
	}
	export function is(node: AstNode | undefined): node is PathNode {
		return (node as PathNode | undefined)?.type === 'mcdoc:path'
	}
}

export interface StructBlockNode extends AstNode {
	type: 'mcdoc:struct/block'
	children: (CommentNode | StructFieldNode)[]
}
export namespace StructBlockNode {
	export function destruct(node: StructBlockNode): { fields: StructFieldNode[] } {
		return { fields: node.children.filter(StructFieldNode.is) }
	}
	export function is(node: AstNode | undefined): node is StructBlockNode {
		return (node as StructBlockNode | undefined)?.type === 'mcdoc:struct/block'
	}
}

export type StructFieldNode = StructPairFieldNode | StructSpreadFieldNode
export namespace StructFieldNode {
	export function is(node: AstNode | undefined): node is StructFieldNode {
		return StructPairFieldNode.is(node) || StructSpreadFieldNode.is(node)
	}
}

export interface StructPairFieldNode extends AstNode {
	type: 'mcdoc:struct/field/pair'
	children: (CommentNode | PrelimNode | StructKeyNode | TypeNode)[]
	isOptional?: boolean
}
export namespace StructPairFieldNode {
	export function destruct(
		node: StructPairFieldNode,
	): {
		attributes: AttributeNode[]
		docComments?: DocCommentsNode
		key: StructKeyNode
		type: TypeNode
		isOptional?: boolean
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			docComments: node.children.find(DocCommentsNode.is),
			key: node.children.find(StructKeyNode.is)!,
			type: node.children.find(TypeNode.is)!,
			isOptional: node.isOptional,
		}
	}
	export function is(node: AstNode | undefined): node is StructPairFieldNode {
		return ((node as StructPairFieldNode | undefined)?.type === 'mcdoc:struct/field/pair')
	}
}

export type StructKeyNode = StringNode | IdentifierNode | StructMapKeyNode
export namespace StructKeyNode {
	export function is(node: AstNode | undefined): node is StructKeyNode {
		return (StringNode.is(node) || IdentifierNode.is(node) || StructMapKeyNode.is(node))
	}
}

export interface StructMapKeyNode extends AstNode {
	type: 'mcdoc:struct/map_key'
	children: (CommentNode | TypeNode)[]
}
export namespace StructMapKeyNode {
	export function destruct(node: StructMapKeyNode): { type: TypeNode } {
		return { type: node.children.find(TypeNode.is)! }
	}
	export function is(node: AstNode | undefined): node is StructMapKeyNode {
		return ((node as StructMapKeyNode | undefined)?.type === 'mcdoc:struct/map_key')
	}
}

export interface StructSpreadFieldNode extends AstNode {
	type: 'mcdoc:struct/field/spread'
	children: (CommentNode | AttributeNode | TypeNode)[]
}
export namespace StructSpreadFieldNode {
	export function destruct(
		node: StructSpreadFieldNode,
	): { attributes: AttributeNode[]; type: TypeNode } {
		return {
			attributes: node.children.filter(AttributeNode.is),
			type: node.children.find(TypeNode.is)!,
		}
	}
	export function is(node: AstNode | undefined): node is StructSpreadFieldNode {
		return ((node as StructSpreadFieldNode | undefined)?.type === 'mcdoc:struct/field/spread')
	}
}

export interface DispatcherTypeNode extends TypeBaseNode<ResourceLocationNode | IndexBodyNode> {
	type: 'mcdoc:type/dispatcher'
}
export namespace DispatcherTypeNode {
	export function destruct(
		node: DispatcherTypeNode,
	): { location: ResourceLocationNode; index: IndexBodyNode } {
		return {
			location: node.children.find(ResourceLocationNode.is)!,
			index: node.children.find(IndexBodyNode.is)!,
		}
	}
	export function is(node: AstNode | undefined): node is DispatcherTypeNode {
		return ((node as DispatcherTypeNode | undefined)?.type === 'mcdoc:type/dispatcher')
	}
}

export interface UnionTypeNode extends TypeBaseNode<TypeNode> {
	type: 'mcdoc:type/union'
}
export namespace UnionTypeNode {
	export function destruct(node: UnionTypeNode): { members: TypeNode[] } {
		return { members: node.children.filter(TypeNode.is) }
	}
	export function is(node: AstNode | undefined): node is UnionTypeNode {
		return (node as UnionTypeNode | undefined)?.type === 'mcdoc:type/union'
	}
}

export interface InjectionNode extends AstNode {
	type: 'mcdoc:injection'
	children: (CommentNode | LiteralNode | InjectionContentNode)[]
}
export namespace InjectionNode {
	export function destruct(node: InjectionNode): { injection: InjectionContentNode } {
		return { injection: node.children.find(InjectionContentNode.is)! }
	}
	export function is(node: AstNode | undefined): node is InjectionNode {
		return (node as InjectionNode | undefined)?.type === 'mcdoc:injection'
	}
}

export type InjectionContentNode = EnumInjectionNode | StructInjectionNode
export namespace InjectionContentNode {
	export function is(node: AstNode | undefined): node is InjectionContentNode {
		return EnumInjectionNode.is(node) || StructInjectionNode.is(node)
	}
}

export interface EnumInjectionNode extends AstNode {
	type: 'mcdoc:injection/enum'
	children: (CommentNode | LiteralNode | PathNode | EnumBlockNode)[]
}
export namespace EnumInjectionNode {
	export function is(node: AstNode | undefined): node is EnumInjectionNode {
		return ((node as EnumInjectionNode | undefined)?.type === 'mcdoc:injection/enum')
	}
}

export interface StructInjectionNode extends AstNode {
	type: 'mcdoc:injection/struct'
	children: (CommentNode | LiteralNode | PathNode | StructBlockNode)[]
}
export namespace StructInjectionNode {
	export function is(node: AstNode | undefined): node is StructInjectionNode {
		return ((node as StructInjectionNode | undefined)?.type === 'mcdoc:injection/struct')
	}
}

export interface TypeAliasNode extends AstNode {
	type: 'mcdoc:type_alias'
	children:
		(CommentNode | PrelimNode | LiteralNode | IdentifierNode | TypeParamBlockNode | TypeNode)[]
}
export namespace TypeAliasNode {
	export function destruct(
		node: TypeAliasNode,
	): {
		attributes: AttributeNode[]
		docComments?: DocCommentsNode
		identifier: IdentifierNode
		keyword: LiteralNode
		typeParams?: TypeParamBlockNode
		rhs?: TypeNode
	} {
		return {
			attributes: node.children.filter(AttributeNode.is),
			docComments: node.children.find(DocCommentsNode.is),
			identifier: node.children.find(IdentifierNode.is)!,
			keyword: node.children.find(LiteralNode.is)!,
			typeParams: node.children.find(TypeParamBlockNode.is),
			rhs: node.children.find(TypeNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is TypeAliasNode {
		return (node as TypeAliasNode | undefined)?.type === 'mcdoc:type_alias'
	}
}

export interface UseStatementNode extends AstNode {
	type: 'mcdoc:use_statement'
	children: (CommentNode | LiteralNode | PathNode | IdentifierNode)[]
}
export namespace UseStatementNode {
	export function destruct(node: UseStatementNode): { binding?: IdentifierNode; path?: PathNode } {
		return {
			binding: node.children.find(IdentifierNode.is),
			path: node.children.find(PathNode.is),
		}
	}
	export function is(node: AstNode | undefined): node is UseStatementNode {
		return ((node as UseStatementNode | undefined)?.type === 'mcdoc:use_statement')
	}
}
