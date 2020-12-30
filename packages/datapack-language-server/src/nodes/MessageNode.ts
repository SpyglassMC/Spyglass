import { toFormattedString } from '../utils'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ArgumentNode, NodeType } from './ArgumentNode'
import { EntityNode } from './EntityNode'

export class MessageNode extends ArgumentNode implements ArrayLike<string | EntityNode> {
	[index: number]: string | EntityNode

	readonly [NodeType] = 'Message'

	length = 0

	constructor() {
		super()
	}

	push(...values: (string | EntityNode)[]) {
		for (const value of values) {
			this[this.length++] = value
		}
	}

	/* istanbul ignore next */
	*[Symbol.iterator](): Iterator<string | EntityNode, any, undefined> {
		// You want me to call myself for iterating? Stupid!
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i = 0; i < this.length; i++) {
			yield this[i]
		}
	}

	[GetFormattedString](lint: LintConfig) {
		return Array.prototype.map.call(this, (v: string | EntityNode) => toFormattedString(v, lint)).join('')
	}
}
