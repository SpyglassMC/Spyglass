import type { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'

export interface ListNode<V extends AstNode> extends AstNode {
	readonly children: ItemNode<V>[]
}

export interface ItemNode<V extends AstNode> extends AstNode {
	readonly type: 'item'
	readonly children?: [V]
	readonly value?: V
	readonly sep?: Range
}
export namespace ItemNode {
	export function is<V extends AstNode>(
		node: object | undefined,
	): node is ItemNode<V> {
		return (node as ItemNode<V> | undefined)?.type === 'item'
	}
}
