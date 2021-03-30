import type { Range } from '../source'
import type { AstNode } from './AstNode'

export interface MapNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly children: PairNode<K, V>[],
}

export interface PairNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly key: K,
	readonly value: V,
	readonly end: Range | null,
}
