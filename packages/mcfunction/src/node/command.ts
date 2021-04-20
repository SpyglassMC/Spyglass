import type * as core from '@spyglassmc/core'
import type { ArgumentNode } from './argument'

export interface CommandNode extends core.SequenceNode<ArgumentNode> {
	type: 'mcfunction:command',
}
export namespace CommandNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is CommandNode {
		return (node as CommandNode).type === 'mcfunction:command'
	}
}
