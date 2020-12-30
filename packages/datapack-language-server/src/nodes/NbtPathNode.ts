import { toFormattedString } from '../utils'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { NbtCompoundKeyNode } from './NbtCompoundKeyNode'
import { NbtCompoundNode } from './NbtCompoundNode'
import { NumberNode } from './NumberNode'

type NbtPathElement =
	| typeof NbtPathNode.IndexBegin
	| typeof NbtPathNode.IndexEnd
	| typeof NbtPathNode.Sep
	| NumberNode
	| NbtCompoundNode
	| NbtCompoundKeyNode

export class NbtPathNode extends ArgumentNode implements ArrayLike<NbtPathElement> {
	[index: number]: NbtPathElement

	static readonly IndexBegin = '['
	static readonly IndexEnd = ']'
	static readonly Sep = '.'

	readonly [NodeType] = 'NbtPath'

	length = 0

	push(...values: NbtPathElement[]) {
		for (const value of values) {
			this[this.length++] = value
		}
	}

	/* istanbul ignore next */
	*[Symbol.iterator](): Iterator<NbtPathElement, any, undefined> {
		// You want me to call myself for iterating? Stupid!
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < this.length; i++) {
			yield this[i]
		}
	}

	[GetFormattedString](lint: LintConfig): string {
		return Array.prototype.map.call(this, (ele: NbtPathElement) => toFormattedString(ele, lint)).join('')
	}
}
