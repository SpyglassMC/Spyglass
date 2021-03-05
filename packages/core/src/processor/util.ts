import { AstNode } from '../node'
import { Range } from '../source'

type Callback<R> = (this: void, leaf: AstNode, parents: AstNode[]) => R

export function traverseLeaves(node: AstNode, fn: Callback<unknown>, range?: Range): void
export function traverseLeaves(node: AstNode, fn: Callback<unknown>, range?: Range, existingParents: AstNode[] = []): void {
	if (range && !Range.intersects(node.range, range)) {
		return
	}
	if (node.children) {
		for (const child of node.children) {
			existingParents.unshift(node);
			(traverseLeaves as any)(child, fn, range, existingParents)
			existingParents.shift()
		}
	} else {
		fn(node, existingParents)
	}
}

// mASteRPiecE /s
// export function traverseLeaves(node: AstNode, fn: Callback<unknown>): void {
// 	// LIFO, but things are inserted at the beginning.
// 	const stack: AstNode[] = [node]
// 	const visitedIndices: number[] = [-1]
// 	while (stack.length) {
// 		let visitedIndex = visitedIndices[0]
// 		if (!top.children || visitedIndex === top.children.length - 1) {
// 			if (!top.children) {
// 				fn(top, stack)
// 			}
// 			stack.shift()
// 			visitedIndices.shift()
// 		} else {
// 			visitedIndex = visitedIndices[0] += 1
// 			stack.unshift(top.children[visitedIndex])
// 			visitedIndices.unshift(-1)
// 		}
// 	}
// }
