import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'
import { LiteralNode } from './LiteralNode.js'

export interface PrefixedNode<C extends AstNode = AstNode> extends AstNode {
	readonly type: 'prefixed'
	readonly children: (LiteralNode | C)[]
	readonly prefix: string
}
export namespace PrefixedNode {
	export function is<C extends AstNode>(obj: object): obj is PrefixedNode<C> {
		return (obj as PrefixedNode<C>).type === 'prefixed'
	}

	export function mock<C extends AstNode>(
		range: RangeLike,
		prefix: string,
		child: C,
	): PrefixedNode<C> {
		return {
			type: 'prefixed',
			range: Range.get(range),
			prefix,
			children: [
				LiteralNode.mock(range, { pool: [prefix] }),
				child,
			],
		}
	}
}
