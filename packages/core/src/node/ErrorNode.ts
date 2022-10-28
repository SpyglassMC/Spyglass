import type { AstNode } from './AstNode.js'

export interface ErrorNode extends AstNode {
	readonly type: 'error'
}

export namespace ErrorNode {
	/* istanbul ignore next */
	export function is(obj: AstNode): obj is ErrorNode {
		return (obj as ErrorNode).type === 'error'
	}
}
