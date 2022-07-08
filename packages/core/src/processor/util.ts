import type { DeepReadonly } from '../index.js'
import type { AstNode } from '../node/index.js'

type Callback<R> = (this: void, node: AstNode, parents: AstNode[]) => R

export function traversePreOrder(node: DeepReadonly<AstNode>, shouldContinue: Callback<unknown>, shouldCallFn: Callback<unknown>, fn: Callback<unknown>): void {
	traversePreOrderImpl(node as AstNode, shouldContinue, shouldCallFn, fn, [])
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
