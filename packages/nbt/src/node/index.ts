import type * as core from '@spyglassmc/core'
import type * as mcdoc from '@spyglassmc/mcdoc'

interface NbtBaseNode {
	typeDef?: mcdoc.runtime.checker.SimplifiedMcdocType
	requireCanonical?: boolean
}

export type NbtNode = NbtPrimitiveNode | NbtCompoundNode | NbtCollectionNode | NbtSnbtFunctionNode
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
export type NbtIntegerAlikeNode =
	| NbtByteNode
	| NbtShortNode
	| NbtIntNode
	| NbtLongNode
	| NbtHexNode
	| NbtBinNode
export namespace NbtIntegerAlikeNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtIntegerAlikeNode {
		return (NbtByteNode.is(node)
			|| NbtShortNode.is(node)
			|| NbtIntNode.is(node)
			|| NbtLongNode.is(node)
			|| NbtHexNode.is(node)
			|| NbtBinNode.is(node))
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

// Hex/binary value nodes are parsed via 0x/0b prefixes. They're not just for integer values -
// any NBT value can be represented in hex/binary. The `prefixRange` marks the location of the
// prefix (`0x` or `0b`) so the colorizer can highlight it as an escape.
interface NbtRadixPrefixRange {
	prefixRange: core.Range
}

export interface NbtHexNode extends core.LongBaseNode, NbtBaseNode, NbtRadixPrefixRange {
	readonly type: 'nbt:hex'
}
export namespace NbtHexNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtHexNode {
		return (node as NbtHexNode | undefined)?.type === 'nbt:hex'
	}
}

export interface NbtBinNode extends core.LongBaseNode, NbtBaseNode, NbtRadixPrefixRange {
	readonly type: 'nbt:bin'
}
export namespace NbtBinNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtBinNode {
		return (node as NbtBinNode | undefined)?.type === 'nbt:bin'
	}
}
// #endregion

// #region NbtSnbtFunctionNode
// Base type for SNBT function calls (e.g. `bool(value)`). Concrete function node types
// (e.g. `nbt:bool`) extend this. `prefixRange` covers the function name and opening
// parenthesis (e.g. `bool(`); `suffixRange` covers the closing parenthesis (`)`). The
// argument(s) are stored as `children`. Colorizers color `prefixRange` and `suffixRange`
// as `escape`.
export type NbtSnbtFunctionNode = NbtBoolNode | NbtUuidNode
export namespace NbtSnbtFunctionNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtSnbtFunctionNode {
		return NbtBoolNode.is(node) || NbtUuidNode.is(node)
	}
}

// `bool(value)` evaluates to `false` if `value` is the numeric literal 0, else `true`.
export interface NbtBoolNode extends core.AstNode, NbtBaseNode {
	readonly type: 'nbt:bool'
	value: boolean
	prefixRange: core.Range
	suffixRange: core.Range
	children: [NbtNode]
}
export namespace NbtBoolNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtBoolNode {
		return (node as NbtBoolNode | undefined)?.type === 'nbt:bool'
	}
}

// `uuid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")` parses a UUID string into a
// 4-element int array (each 32-bit group as an int).
export interface NbtUuidNode extends core.AstNode, NbtBaseNode {
	readonly type: 'nbt:uuid'
	value: number[]
	prefixRange: core.Range
	suffixRange: core.Range
	children: [NbtStringNode]
}
export namespace NbtUuidNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtUuidNode {
		return (node as NbtUuidNode | undefined)?.type === 'nbt:uuid'
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

export type NbtPathChild = NbtPathKeyNode | NbtPathFilterNode | NbtPathIndexNode

export interface NbtPathNode extends core.AstNode {
	type: 'nbt:path'
	children: NbtPathChild[]
	/**
	 * The type definition at the end of the path
	 */
	endTypeDef?: mcdoc.runtime.checker.SimplifiedMcdocType
}
export namespace NbtPathNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPathNode {
		return (node as NbtPathNode | undefined)?.type === 'nbt:path'
	}
}

export interface NbtPathKeyNode extends core.AstNode, NbtBaseNode {
	type: 'nbt:path/key'
	children: [NbtStringNode]
}
export namespace NbtPathKeyNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPathKeyNode {
		return (node as NbtPathKeyNode | undefined)?.type === 'nbt:path/key'
	}
}

export interface NbtPathFilterNode extends core.AstNode, NbtBaseNode {
	type: 'nbt:path/filter'
	children: [NbtCompoundNode]
}
export namespace NbtPathFilterNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode | undefined): node is NbtPathFilterNode {
		return (node as NbtPathFilterNode | undefined)?.type === 'nbt:path/filter'
	}
}

export interface NbtPathIndexNode extends core.AstNode, NbtBaseNode {
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
