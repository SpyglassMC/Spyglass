import binarySearch from 'binary-search'
import type { Color, FormattableColor } from '../processor/index.js'
import { Range } from '../source/index.js'
import type { Symbol, SymbolTable } from '../symbol/index.js'

export interface AstNode {
	readonly type: string,
	readonly range: Range,
	/**
	 * All child nodes of this AST node.
	 */
	readonly children?: AstNode[],
	readonly parent?: AstNode,
	locals?: SymbolTable,
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

	interface FindRecursivelyOptions<P = (node: AstNode) => boolean> {
		node: AstNode,
		needle: number,
		endInclusive?: boolean,
		predicate?: P,
	}
	/**
	 * @returns The deepest node that both contains `needle` and satisfies the `predicate`.
	 */
	export function findDeepestChild<N extends AstNode>(options: FindRecursivelyOptions<(node: AstNode) => node is N>): N | undefined
	export function findDeepestChild(options: FindRecursivelyOptions): AstNode | undefined
	export function findDeepestChild({ node, needle, endInclusive = false, predicate = () => true }: FindRecursivelyOptions): AstNode | undefined {
		let last: AstNode | undefined
		let head = Range.contains(node, needle, endInclusive) ? node : undefined
		while (head && predicate(head)) {
			last = head
			head = findChild(head, needle, endInclusive)
		}
		return last
	}

	/**
	 * @returns The shallowest node that both contains `needle` and satisfies the `predicate`.
	 */
	export function findShallowestChild<N extends AstNode>(options: FindRecursivelyOptions<(node: AstNode) => node is N>): N | undefined
	export function findShallowestChild(options: FindRecursivelyOptions): AstNode | undefined
	export function findShallowestChild({ node, needle, endInclusive = false, predicate = () => true }: FindRecursivelyOptions): AstNode | undefined {
		let head = Range.contains(node, needle, endInclusive) ? node : undefined
		while (head && !predicate(head)) {
			head = findChild(head, needle, endInclusive)
		}
		return head
	}

	export function* getLocalsToRoot(node: AstNode): Generator<SymbolTable> {
		let head: AstNode | undefined = node
		while (head) {
			if (head.locals) {
				yield head.locals
			}
			head = node.parent
		}
	}

	export function* getLocalsToLeaves(node: AstNode): Generator<SymbolTable> {
		if (node.locals) {
			yield node.locals
		}
		for (const child of node.children ?? []) {
			yield* getLocalsToLeaves(child)
		}
	}
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
