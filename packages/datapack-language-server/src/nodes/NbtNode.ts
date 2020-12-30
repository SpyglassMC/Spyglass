import { ArgumentNode, NodeType } from './ArgumentNode'
import { NbtCompoundNode } from './NbtCompoundNode'

export type NbtNodeTypeName =
	| 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String'
	| 'ByteArray' | 'IntArray' | 'LongArray' | 'Compound' | 'List'

export const NbtNodeType = Symbol('NbtNodeType')
export const SuperNode = Symbol('SuperNode')

export abstract class NbtNode extends ArgumentNode {
	abstract [NodeType]: string
	abstract [NbtNodeType]: NbtNodeTypeName

	[SuperNode]: NbtCompoundNode | null
	constructor(superNbt: NbtCompoundNode | null) {
		super()
		this[SuperNode] = superNbt
	}
}

export function isNbtNodeTypeStrictlyMatched(actual: NbtNodeTypeName, expected: NbtNodeTypeName) {
	return expected === actual
}

export function isNbtNodeTypeLooselyMatched(actual: NbtNodeTypeName, expected: NbtNodeTypeName) {
	return isNbtNodeTypeStrictlyMatched(actual, expected) || (
		actual === 'Int' &&
		(expected === 'Byte' || expected === 'Short' || expected === 'Long' || expected === 'Float' || expected === 'Double')
	)
}
