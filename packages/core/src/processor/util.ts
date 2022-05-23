import type { AstNode } from '../node/index.js'
import { Range } from '../source/index.js'

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

interface NodeResult {
	node: AstNode | undefined,
	/**
	 * Ordered from the closest parent to the root node.
	 */
	parents: AstNode[],
}

/**
 * @returns The shallowest node that is fully contained within `range`.
 */
export function findNode(node: AstNode, range: Range): NodeResult {
	let ans: NodeResult = { node: undefined, parents: [] }
	// TODO: Binary search here.
	traversePreOrder(node,
		(node) => ans.node === undefined && Range.intersects(node.range, range),
		(node) => Range.containsRange(range, node.range),
		(node, parents) => ans = { node, parents: [...parents] },
	)
	return ans
}
