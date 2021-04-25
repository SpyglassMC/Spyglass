import type { AstNode } from './AstNode'

export interface BooleanBaseNode extends AstNode {
	readonly value?: boolean,
}

export interface BooleanNode extends BooleanBaseNode {
	readonly type: 'boolean',
}

export namespace BooleanNode {
	/* istanbul ignore next */
	export function is(obj: AstNode): obj is BooleanNode {
		return (obj as BooleanNode).type === 'boolean'
	}
}
