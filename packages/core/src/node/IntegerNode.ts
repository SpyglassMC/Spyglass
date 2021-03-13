import type { AstNode } from './AstNode'

export interface IntegerNode extends AstNode {
	type: 'integer',
	value: bigint,
}
export namespace IntegerNode {
	export function is(obj: object): obj is IntegerNode {
		return (obj as IntegerNode).type === 'integer'
	}
}
