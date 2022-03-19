import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AstNode } from './AstNode'

export interface FloatBaseNode extends AstNode {
	readonly value: number,
}

export interface FloatNode extends FloatBaseNode {
	readonly type: 'float',
}
export namespace FloatNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is FloatNode {
		return (obj as FloatNode).type === 'float'
	}

	export function mock(range: RangeLike): FloatNode {
		return {
			type: 'float',
			range: Range.get(range),
			value: 0,
		}
	}
}
