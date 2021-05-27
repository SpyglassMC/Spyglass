import type { Color, FormattableColor } from '../processor'
import { Range } from '../source'
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
	color?: Color | FormattableColor,
}
export namespace AstNode {
	/* istanbul ignore next */
	export function is(obj: unknown): obj is AstNode {
		return typeof (obj as AstNode).type === 'string'
			&& Range.is((obj as AstNode).range)
	}
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
