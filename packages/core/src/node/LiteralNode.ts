import type { ColorTokenType } from '../processor/index.js'
import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'

export interface LiteralOptions {
	pool: string[]
	colorTokenType?: ColorTokenType
}

export interface LiteralBaseNode extends AstNode {
	readonly options: LiteralOptions
	value: string
}

export interface LiteralNode extends LiteralBaseNode {
	readonly type: 'literal'
}
export namespace LiteralNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is LiteralNode {
		return (obj as LiteralNode | undefined)?.type === 'literal'
	}

	export function mock(range: RangeLike, options: LiteralOptions): LiteralNode {
		return { type: 'literal', range: Range.get(range), options, value: '' }
	}
}
