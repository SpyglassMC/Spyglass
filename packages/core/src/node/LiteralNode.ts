import type { AstNode } from './AstNode'

export interface LiteralOptions {
	pool: string[],
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
}
