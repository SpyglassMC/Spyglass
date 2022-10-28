import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'

export interface BooleanBaseNode extends AstNode {
	readonly value?: boolean
}

export interface BooleanNode extends BooleanBaseNode {
	readonly type: 'boolean'
}

export namespace BooleanNode {
	/* istanbul ignore next */
	export function is(obj: AstNode): obj is BooleanNode {
		return (obj as BooleanNode).type === 'boolean'
	}

	export function mock(range: RangeLike): BooleanNode {
		return {
			type: 'boolean',
			range: Range.get(range),
		}
	}
}
