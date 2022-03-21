import type { Range } from '../source'
import type { AstNode } from './AstNode'

export interface RecordBaseNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly children: PairNode<K, V>[],
}

export interface RecordNode<K extends AstNode, V extends AstNode> extends RecordBaseNode<K, V> {
	type: 'record',
}

export interface PairNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly type: 'pair',
	readonly children?: [K, V] | [K] | [V],
	readonly key?: K,
	readonly sep?: Range,
	readonly value?: V,
	readonly end?: Range,
}
export namespace PairNode {
	export function is<K extends AstNode, V extends AstNode>(node: AstNode | undefined): node is PairNode<K, V> {
		return (node as PairNode<K, V> | undefined)?.type === 'pair'
	}
}
