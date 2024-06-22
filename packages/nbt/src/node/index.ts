import type * as core from '@spyglassmc/core'
import type * as mcdoc from '@spyglassmc/mcdoc'

interface NbtBaseNode {
	typeDef?: mcdoc.runtime.checker.SimplifiedMcdocType
}

export type NbtNode = NbtPrimitiveNode | NbtCompoundNode | NbtCollectionNode
export namespace NbtNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtNode {
		return (NbtPrimitiveNode.is(node) || NbtCompoundNode.is(node) || NbtCollectionNode.is(node))
	}
}

// #region NbtPrimitiveNode
export type NbtPrimitiveNode = NbtNumberNode | NbtStringNode
export namespace NbtPrimitiveNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPrimitiveNode {
		return NbtNumberNode.is(node) || NbtStringNode.is(node)
	}
}

export interface NbtStringNode extends core.StringBaseNode, NbtBaseNode {
	readonly type: 'nbt:string'
}
export namespace NbtStringNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is NbtStringNode {
		return (obj as NbtStringNode | undefined)?.type === 'nbt:string'
	}
}

// #region NbtNumberNode
export type NbtNumberNode = NbtIntegerAlikeNode | NbtFloatAlikeNode
export namespace NbtNumberNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtNumberNode {
		return NbtIntegerAlikeNode.is(node) || NbtFloatAlikeNode.is(node)
	}
}

// #region NbtIntegerAlikeNode
export type NbtIntegerAlikeNode = NbtByteNode | NbtShortNode | NbtIntNode | NbtLongNode
export namespace NbtIntegerAlikeNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtIntegerAlikeNode {
		return (NbtByteNode.is(node)
			|| NbtShortNode.is(node)
			|| NbtIntNode.is(node)
			|| NbtLongNode.is(node))
	}
}

export interface NbtByteNode extends core.IntegerBaseNode, NbtBaseNode {
	readonly type: 'nbt:byte'
}
export namespace NbtByteNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtByteNode {
		return (node as NbtByteNode | undefined)?.type === 'nbt:byte'
	}
}

export interface NbtShortNode extends core.IntegerBaseNode, NbtBaseNode {
	readonly type: 'nbt:short'
}
export namespace NbtShortNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtShortNode {
		return (node as NbtShortNode | undefined)?.type === 'nbt:short'
	}
}

export interface NbtIntNode extends core.IntegerBaseNode, NbtBaseNode {
	readonly type: 'nbt:int'
}
export namespace NbtIntNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtIntNode {
		return (node as NbtIntNode | undefined)?.type === 'nbt:int'
	}
}

export interface NbtLongNode extends core.LongBaseNode, NbtBaseNode {
	readonly type: 'nbt:long'
}
export namespace NbtLongNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtLongNode {
		return (node as NbtLongNode | undefined)?.type === 'nbt:long'
	}
}
// #endregion

// #region NbtFloatAlikeNode
export type NbtFloatAlikeNode = NbtFloatNode | NbtDoubleNode
export namespace NbtFloatAlikeNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtFloatAlikeNode {
		return NbtFloatNode.is(node) || NbtDoubleNode.is(node)
	}
}

export interface NbtFloatNode extends core.FloatBaseNode, NbtBaseNode {
	readonly type: 'nbt:float'
}
export namespace NbtFloatNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtFloatNode {
		return (node as NbtFloatNode | undefined)?.type === 'nbt:float'
	}
}

export interface NbtDoubleNode extends core.FloatBaseNode, NbtBaseNode {
	readonly type: 'nbt:double'
}
export namespace NbtDoubleNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtDoubleNode {
		return (node as NbtDoubleNode | undefined)?.type === 'nbt:double'
	}
}
// #endregion
// #endregion
// #endregion

export interface NbtCompoundNode extends core.RecordBaseNode<NbtStringNode, NbtNode>, NbtBaseNode {
	readonly type: 'nbt:compound'
}
export namespace NbtCompoundNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtCompoundNode {
		return (node as NbtCompoundNode | undefined)?.type === 'nbt:compound'
	}
}

// #region NbtCollectionNode
export type NbtCollectionNode = NbtListNode | NbtPrimitiveArrayNode
export namespace NbtCollectionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtCollectionNode {
		return NbtListNode.is(node) || NbtPrimitiveArrayNode.is(node)
	}
}

export interface NbtListNode extends core.ListNode<NbtNode>, NbtBaseNode {
	type: 'nbt:list'
	valueType?: NbtNode['type']
}
export namespace NbtListNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtListNode {
		return (node as NbtListNode | undefined)?.type === 'nbt:list'
	}
}

// #region NbtPrimitiveArrayNode
export type NbtPrimitiveArrayNode = NbtByteArrayNode | NbtIntArrayNode | NbtLongArrayNode
export namespace NbtPrimitiveArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPrimitiveArrayNode {
		return (NbtByteArrayNode.is(node) || NbtIntArrayNode.is(node) || NbtLongArrayNode.is(node))
	}
}

export interface NbtByteArrayNode extends core.ListNode<NbtByteNode>, NbtBaseNode {
	type: 'nbt:byte_array'
}
export namespace NbtByteArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtByteArrayNode {
		return (node as NbtByteArrayNode | undefined)?.type === 'nbt:byte_array'
	}
}

export interface NbtIntArrayNode extends core.ListNode<NbtIntNode>, NbtBaseNode {
	type: 'nbt:int_array'
}
export namespace NbtIntArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtIntArrayNode {
		return (node as NbtIntArrayNode | undefined)?.type === 'nbt:int_array'
	}
}

export interface NbtLongArrayNode extends core.ListNode<NbtLongNode>, NbtBaseNode {
	type: 'nbt:long_array'
}
export namespace NbtLongArrayNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtLongArrayNode {
		return (node as NbtLongArrayNode | undefined)?.type === 'nbt:long_array'
	}
}
// #endregion
// #endregion

export type NbtPathChild = NbtStringNode | NbtCompoundNode | NbtPathIndexNode

export interface NbtPathNode extends core.AstNode {
	type: 'nbt:path'
	children: NbtPathChild[]
	targetType?: mcdoc.McdocType | undefined
}
export namespace NbtPathNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPathNode {
		return (node as NbtPathNode | undefined)?.type === 'nbt:path'
	}
}

export interface NbtPathIndexNode extends core.AstNode {
	type: 'nbt:path/index'
	children: [core.IntegerNode] | [NbtCompoundNode] | undefined
}
export namespace NbtPathIndexNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPathIndexNode {
		return (node as NbtPathIndexNode | undefined)?.type === 'nbt:path/index'
	}
}

export interface TypedNbtNode extends core.AstNode {
	type: 'nbt:typed'
	children: [NbtNode]
	targetType: mcdoc.McdocType
}
export namespace TypedNbtNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is TypedNbtNode {
		return (node as TypedNbtNode | undefined)?.type === 'nbt:typed'
	}
}
