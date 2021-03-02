import { AstNode } from './AstNode'

export interface ErrorNode extends AstNode {
	type: 'error',
}

export namespace ErrorNode {
	/* istanbul ignore next */
	export function is(obj: AstNode): obj is ErrorNode {
		return (obj as ErrorNode).type === 'error'
	}
}
