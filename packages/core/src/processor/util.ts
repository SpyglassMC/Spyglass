import { AstNode } from '../node'

export function traverseLeaves(node: AstNode, fn: (this: void, leaf: AstNode, parents: AstNode[]) => unknown, /** @internal */ existingParents: AstNode[] = []): void {
	if (node.children) {
		for (const child of node.children) {
			existingParents.push(node)
			traverseLeaves(child, fn, existingParents)
			existingParents.pop()
		}
	} else {
		fn(node, existingParents)
	}
}

// mASteRPiecE /s
// export function traverseLeaves(node: AstNode, fn: (this: void, leaf: AstNode, parents: AstNode[]) => unknown): void {
// 	// LIFO, but things are inserted at the beginning.
// 	const stack: AstNode[] = [node]
// 	const visitedIndices: number[] = [-1]
// 	while (stack.length) {
// 		const top = stack[stack.length - 1]
// 		let visitedIndex = visitedIndices[stack.length - 1]
// 		if (!top.children || visitedIndex === top.children.length - 1) {
// 			if (!top.children) {
// 				fn(top, stack)
// 			}
// 			stack.shift()
// 			visitedIndices.shift()
// 		} else {
// 			visitedIndex = visitedIndices[stack.length - 1] += 1
// 			stack.unshift(top.children[visitedIndex])
// 			visitedIndices.unshift(-1)
// 		}
// 	}
// }
