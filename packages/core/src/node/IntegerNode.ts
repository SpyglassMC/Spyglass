import type { AstNode } from './AstNode'

export interface IntegerNode extends AstNode {
	readonly type: 'integer',
	readonly value: bigint,
}
export namespace IntegerNode {
	export function is(obj: object): obj is IntegerNode {
		return (obj as IntegerNode).type === 'integer'
	}
}
