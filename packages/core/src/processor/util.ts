import type { AstNode } from '../node'
import { IndexMap, Range } from '../source'

type Callback<R> = (this: void, result: { node: AstNode, parents: AstNode[], map: IndexMap }) => R

export function traversePreOrder(node: AstNode, shouldContinue: Callback<unknown>, shouldCallFn: Callback<unknown>, fn: Callback<unknown>): void {
	traversePreOrderImpl(node, shouldContinue, shouldCallFn, fn, [], IndexMap.DEFAULT)
}

function traversePreOrderImpl(node: AstNode, shouldContinue: Callback<unknown>, shouldCallFn: Callback<unknown>, fn: Callback<unknown>, parents: AstNode[], map: IndexMap): void {
	if (shouldCallFn({ node, parents, map })) {
		fn({ node, parents, map })
	}
	if (!node.children || !shouldContinue({ node, parents, map })) {
		return
	}
	let i = 0
	for (const child of node.children ?? []) {
		parents.unshift(node)
		if (node.childrenMaps) {
			map = IndexMap.merge(map, node.childrenMaps[i])
		}
		traversePreOrderImpl(child, shouldContinue, shouldCallFn, fn, parents, map)
		parents.shift()
		i += 1
	}
}

type NodeResult = { node: AstNode | undefined, parents: AstNode[], map: IndexMap }

export function selectedNode(node: AstNode, offset: number): NodeResult {
	let ans: NodeResult = { node: undefined, parents: [], map: IndexMap.DEFAULT }
	// TODO: Binary search here.
	traversePreOrder(node,
		({ node, map }) => IndexMap.containsOuterOffset(node.range, offset, map),
		({ node, map }) => IndexMap.containsOuterOffset(node.range, offset, map),
		({ node, map, parents }) => ans = { node, map, parents: [...parents] },
	)
	return ans
}

export function findNode(node: AstNode, range: Range): NodeResult {
	let ans: NodeResult = { node: undefined, parents: [], map: IndexMap.DEFAULT }
	// TODO: Binary search here.
	traversePreOrder(node,
		({ node, map }) => ans.node === undefined && Range.intersects(node.range, IndexMap.toInnerRange(map, range)),
		({ node, map }) => Range.equals(node.range, IndexMap.toInnerRange(map, range)),
		({ node, map, parents }) => ans = { node, map, parents: [...parents] },
	)
	return ans
}
