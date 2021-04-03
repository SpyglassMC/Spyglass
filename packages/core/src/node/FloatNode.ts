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
}
