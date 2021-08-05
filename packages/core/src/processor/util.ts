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
		(node, parents ) => ans = { node, parents: [...parents] },
	)
	return ans
}
