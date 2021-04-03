import type { Range } from '../source'
import type { AstNode } from './AstNode'

export interface ListNode<V extends AstNode> extends AstNode {
	readonly children: ItemNode<V>[],
}

export interface ItemNode<V extends AstNode> extends AstNode {
	readonly children?: [V],
	readonly value?: V,
	readonly sep?: Range,
}
