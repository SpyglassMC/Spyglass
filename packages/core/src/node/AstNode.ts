import binarySearch from 'binary-search'
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

	/**
	 * @param endInclusive Defaults to `false`.
	 */
	export function findChildIndex(node: AstNode, needle: number | Range, endInclusive = false): number {
		if (!node.children) {
			return -1
		}
		const comparator = typeof needle === 'number' ? Range.compareOffset : Range.compare
		return binarySearch(node.children, needle, (a, b) => comparator(a.range, b as number & Range, endInclusive))
	}

	/**
	 * @param endInclusive Defaults to `false`.
	 */
	export function findChild<N extends AstNode>(node: N, needle: number | Range, endInclusive = false): Exclude<N['children'], undefined>[number] | undefined {
		return node.children?.[findChildIndex(node, needle, endInclusive)] as any
	}

	/**
	 * Returns the index of the last child node that ends before the `needle`.
	 * 
	 * @param endInclusive Defaults to `false`.
	 */
	export function findLastChildIndex(node: AstNode, needle: number | Range, endInclusive = false): number {
		if (!node.children) {
			return -1
		}

		let ans = -1
		for (const [i, childNode] of node.children.entries()) {
			if (Range.endsBefore(childNode.range, needle, endInclusive)) {
				ans = i
			} else {
				break
			}
		}
		return ans
	}

	/**
	 * @param endInclusive Defaults to `false`.
	 */
	export function findLastChild<N extends AstNode>(node: N, needle: number | Range, endInclusive = false): (N['children'] extends unknown[] ? N['children'][number] : undefined) | undefined {
		return node.children?.[findLastChildIndex(node, needle, endInclusive)] as any
	}
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
