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
	readonly parent?: AstNode,
	symbol?: Symbol,
	symbolArenaId?: number,
	hover?: string,
	/**
	 * An actual color that this node represents.
	 */
	color?: Color | FormattableColor,
}
export namespace AstNode {
	/* istanbul ignore next */
	export function is(obj: unknown): obj is AstNode {
		return !!obj && typeof obj === 'object' && typeof (obj as AstNode).type === 'string' &&
			Range.is((obj as AstNode).range)
	}

	export function setParents(node: AstNode): void {
		for (const child of node.children ?? []) {
			(child as Mutable<AstNode>).parent = node
			setParents(child)
		}
	}

	export function getSymbolArenaId(node: AstNode | undefined): number | undefined {
		while (node) {
			if (node.symbolArenaId !== undefined) {
				return node.symbolArenaId
			}
			node = node.parent
		}
		return undefined
	}
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
