import type { Range } from '../source'
import type { AstNode } from './AstNode'

export interface TableNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly children: PairNode<K, V>[],
}

export interface PairNode<K extends AstNode, V extends AstNode> extends AstNode {
	readonly children?: [K, V] | [K] | [V],
	readonly key?: K,
	readonly sep?: Range,
	readonly value?: V,
	readonly end?: Range,
}
