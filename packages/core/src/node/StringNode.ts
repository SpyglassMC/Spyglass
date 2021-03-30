import type { IndexMap } from '../source'
import type { AstNode } from './AstNode'

export interface StringNode extends AstNode {
	readonly type: 'string',
	readonly value: string,
	readonly valueMap: IndexMap,
	readonly valueNode?: AstNode,
}
export namespace StringNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is StringNode {
		return (obj as StringNode).type === 'string'
	}
}
