import type { AstNode } from './AstNode'

export interface IntegerBaseNode extends AstNode {
	readonly value: bigint,
}

export interface IntegerNode extends IntegerBaseNode {
	readonly type: 'integer',
}
export namespace IntegerNode {
	export function is(obj: object): obj is IntegerNode {
		return (obj as IntegerNode).type === 'integer'
	}
}
