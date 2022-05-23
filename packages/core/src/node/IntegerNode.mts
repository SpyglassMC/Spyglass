import type { RangeLike } from '../source/index.mjs'
import { Range } from '../source/index.mjs'
import type { AstNode } from './AstNode.mjs'

export interface IntegerBaseNode extends AstNode {
	readonly value: number,
}

export interface IntegerNode extends IntegerBaseNode {
	readonly type: 'integer',
}
export namespace IntegerNode {
	export function is(obj: object): obj is IntegerNode {
		return (obj as IntegerNode).type === 'integer'
	}

	export function mock(range: RangeLike): IntegerNode {
		return {
			type: 'integer',
			range: Range.get(range),
			value: 0,
		}
	}
}
