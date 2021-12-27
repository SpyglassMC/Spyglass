import binarySearch from 'binary-search'
import type { AstNode } from '../node'
import { Range } from '../source'

type Callback<R> = (this: void, node: AstNode, parents: AstNode[]) => R

export function traversePreOrder(node: AstNode, shouldContinue: Callback<unknown>, shouldCallFn: Callback<unknown>, fn: Callback<unknown>): void {
	traversePreOrderImpl(node, shouldContinue, shouldCallFn, fn, [])
}

function traversePreOrderImpl(node: AstNode, shouldContinue: Callback<unknown>, shouldCallFn: Callback<unknown>, fn: Callback<unknown>, parents: AstNode[]): void {
	if (shouldCallFn(node, parents)) {
		fn(node, parents)
	}
	if (!node.children || !shouldContinue(node, parents)) {
		return
	}
	for (const child of node.children ?? []) {
		parents.unshift(node)
		traversePreOrderImpl(child, shouldContinue, shouldCallFn, fn, parents)
		parents.shift()
	}
}

type NodeResult = { node: AstNode | undefined, parents: AstNode[] }

export function selectedNode(node: AstNode, offset: number): NodeResult {
	let ans: NodeResult = { node: undefined, parents: [] }
	// TODO: Binary search here.
	traversePreOrder(node,
		(node) => Range.contains(node.range, offset),
		(node) => Range.contains(node.range, offset),
		(node, parents) => ans = { node, parents: [...parents] },
	)
	return ans
}

export function findNode(node: AstNode, range: Range): NodeResult {
	let ans: NodeResult = { node: undefined, parents: [] }
	// TODO: Binary search here.
	traversePreOrder(node,
		(node) => ans.node === undefined && Range.intersects(node.range, range),
		(node) => Range.equals(node.range, range),
		(node, parents) => ans = { node, parents: [...parents] },
	)
	return ans
}

/**
 * @param endInclusive Defaults to `false`.
 */
export function findChildIndex(node: AstNode, needle: number | Range, endInclusive = false): number {
	if (!node.children) {
		return -1
	}
	const comparator = typeof needle === 'number'
		? endInclusive ? Range.compareOffsetInclusive : Range.compareOffset
		: endInclusive ? Range.compareInclusive : Range.compare
	return binarySearch(node.children, needle, (a, b) => comparator(a.range, b as number & Range))
}

/**
 * @param endInclusive Defaults to `false`.
 */
export function findChild(node: AstNode, needle: number | Range, endInclusive = false): AstNode | undefined {
	return node.children?.[findChildIndex(node, needle, endInclusive)]
}
