import type { IndexMap } from '../source'
import type { AstNode } from './AstNode'

export interface StringBaseNode extends AstNode {
	readonly value: string,
	readonly valueMap: IndexMap,
	valueNode?: AstNode,
}

export interface StringNode extends StringBaseNode {
	readonly type: 'string',
}
export namespace StringNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is StringNode {
		return (obj as StringNode).type === 'string'
	}
}
