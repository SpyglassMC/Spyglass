import type { AstNode } from './AstNode'

export interface FloatNode extends AstNode {
	type: 'float',
	value: number,
}
export namespace FloatNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is FloatNode {
		return (obj as FloatNode).type === 'float'
	}
}
