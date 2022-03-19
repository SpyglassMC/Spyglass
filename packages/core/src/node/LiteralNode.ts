import type { ColorTokenType } from '../processor'
import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AstNode } from './AstNode'

export interface LiteralOptions {
	pool: string[],
	colorTokenType?: ColorTokenType,
}

export interface LiteralBaseNode extends AstNode {
	readonly options: LiteralOptions,
	readonly value: string,
}

export interface LiteralNode extends LiteralBaseNode {
	readonly type: 'literal',
}
export namespace LiteralNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is LiteralNode {
		return (obj as LiteralNode).type === 'literal'
	}

	export function mock(range: RangeLike, options: LiteralOptions): LiteralNode {
		return {
			type: 'literal',
			range: Range.get(range),
			options,
			value: '',
		}
	}
}
