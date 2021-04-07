import type { Color } from '../processor'
import type { Range } from '../source'
import type { Symbol } from '../symbol'

export interface AstNode {
	readonly type: string,
	readonly range: Range,
	/**
	 * All child nodes of this AST node.
	 */
	readonly children?: AstNode[],
	symbol?: Symbol,
	hover?: string,
	/**
	 * An actual color that this node represents.
	 */
	color?: Color,
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
