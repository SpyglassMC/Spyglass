import * as core from '@spyglassmc/core'
import type * as nbtdoc from '@spyglassmc/nbtdoc'

export type NbtNode =
	| NbtPrimitiveNode
	| NbtCompoundNode
	| NbtCollectionNode
export namespace NbtNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtNode {
		return NbtPrimitiveNode.is(node) || NbtCompoundNode.is(node) || NbtCollectionNode.is(node)
	}
}

//#region NbtPrimitiveNode
export type NbtPrimitiveNode =
	| NbtNumberNode
	| core.StringNode
export namespace NbtPrimitiveNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtPrimitiveNode {
		return NbtNumberNode.is(node) || core.StringNode.is(node)
	}
}

//#region NbtNumberNode
export type NbtNumberNode =
	| NbtIntegerAlikeNode
	| NbtFloatAlikeNode
export namespace NbtNumberNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtNumberNode {
		return NbtIntegerAlikeNode.is(node) || NbtFloatAlikeNode.is(node)
	}
}

//#region NbtIntegerAlikeNode
export type NbtIntegerAlikeNode =
	| NbtByteNode
	| NbtShortNode
	| NbtIntNode
	| NbtLongNode
export namespace NbtIntegerAlikeNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtIntegerAlikeNode {
		return NbtByteNode.is(node) || NbtShortNode.is(node) || NbtIntNode.is(node) || NbtLongNode.is(node)
	}
}

export interface NbtByteNode extends core.IntegerBaseNode {
	readonly type: 'nbt:byte',
}
export namespace NbtByteNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtByteNode {
		return (node as NbtByteNode).type === 'nbt:byte'
	}
}

export interface NbtShortNode extends core.IntegerBaseNode {
	readonly type: 'nbt:short',
}
export namespace NbtShortNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtShortNode {
		return (node as NbtShortNode).type === 'nbt:short'
	}
}

export interface NbtIntNode extends core.IntegerBaseNode {
	readonly type: 'nbt:int',
}
export namespace NbtIntNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtIntNode {
		return (node as NbtIntNode).type === 'nbt:int'
	}
}

export interface NbtLongNode extends core.LongBaseNode {
	readonly type: 'nbt:long',
}
export namespace NbtLongNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtLongNode {
		return (node as NbtLongNode).type === 'nbt:long'
	}
}
//#endregion

//#region NbtFloatAlikeNode
export type NbtFloatAlikeNode =
	| NbtFloatNode
	| NbtDoubleNode
export namespace NbtFloatAlikeNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtFloatAlikeNode {
		return NbtFloatNode.is(node) || NbtDoubleNode.is(node)
	}
}

export interface NbtFloatNode extends core.FloatBaseNode {
	readonly type: 'nbt:float',
}
export namespace NbtFloatNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtFloatNode {
		return (node as NbtFloatNode).type === 'nbt:float'
	}
}

export interface NbtDoubleNode extends core.FloatBaseNode {
	readonly type: 'nbt:double',
}
export namespace NbtDoubleNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtDoubleNode {
		return (node as NbtDoubleNode).type === 'nbt:double'
	}
}
//#endregion
//#endregion
//#endregion

export interface NbtCompoundNode extends core.TableNode<core.StringNode, NbtNode> {
	readonly type: 'nbt:compound'
}
export namespace NbtCompoundNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtCompoundNode {
		return (node as NbtCompoundNode).type === 'nbt:compound'
	}
}

//#region NbtCollectionNode
export type NbtCollectionNode =
	| NbtListNode
	| NbtPrimitiveArrayNode
export namespace NbtCollectionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtCollectionNode {
		return NbtListNode.is(node) || NbtPrimitiveArrayNode.is(node)
	}
}

export interface NbtListNode extends core.ListNode<NbtNode> {
	readonly type: 'nbt:list',
	readonly valueType?: NbtNode['type'],
}
export namespace NbtListNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtListNode {
		return (node as NbtListNode | undefined)?.type === 'nbt:list'
	}
}

//#region NbtPrimitiveArrayNode
export type NbtPrimitiveArrayNode =
	| NbtByteArrayNode
	| NbtIntArrayNode
	| NbtLongArrayNode
export namespace NbtPrimitiveArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtPrimitiveArrayNode {
		return NbtByteArrayNode.is(node) || NbtIntArrayNode.is(node) || NbtLongArrayNode.is(node)
	}
}

export interface NbtByteArrayNode extends core.ListNode<NbtByteNode> {
	readonly type: 'nbt:byte_array',
}
export namespace NbtByteArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtByteArrayNode {
		return (node as NbtByteArrayNode).type === 'nbt:byte_array'
	}
}

export interface NbtIntArrayNode extends core.ListNode<NbtIntNode> {
	readonly type: 'nbt:int_array',
}
export namespace NbtIntArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtIntArrayNode {
		return (node as NbtIntArrayNode).type === 'nbt:int_array'
	}
}

export interface NbtLongArrayNode extends core.ListNode<NbtLongNode> {
	readonly type: 'nbt:long_array',
}
export namespace NbtLongArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtLongArrayNode {
		return (node as NbtLongArrayNode).type === 'nbt:long_array'
	}
}
//#endregion
//#endregion

export interface NbtPathNode extends core.AstNode {
	type: 'nbt:path',
	children: (core.StringNode | NbtCompoundNode | NbtPathIndexNode)[],
	targetType?: nbtdoc.CompoundFieldTypeNode.SymbolData | undefined,
}
export namespace NbtPathNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtPathNode {
		return (node as NbtPathNode).type === 'nbt:path'
	}
}

export interface NbtPathIndexNode extends core.AstNode {
	type: 'nbt:path/index',
	children: [core.IntegerNode] | [NbtCompoundNode] | undefined,
}
export namespace NbtPathIndexNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is NbtPathIndexNode {
		return (node as NbtPathIndexNode).type === 'nbt:path/index'
	}
}
