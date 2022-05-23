import type { RangeLike } from '../source/index.mjs'
import { Range } from '../source/index.mjs'
import type { AstNode } from './AstNode.mjs'

export interface LongBaseNode extends AstNode {
	readonly value: bigint,
}

export interface LongNode extends LongBaseNode {
	readonly type: 'long',
}
export namespace LongNode {
	export function is(obj: object): obj is LongNode {
		return (obj as LongNode).type === 'long'
	}

	export function mock(range: RangeLike): LongNode {
		return {
			type: 'long',
			range: Range.get(range),
			value: 0n,
		}
	}
}
