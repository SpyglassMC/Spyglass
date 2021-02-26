import { AstNode } from '../node'

export function traverseLeaves(node: AstNode, fn: (this: void, leaf: AstNode) => unknown) {
	console.log(`Traverse ${JSON.stringify(node)}`)
	if (node.children) {
		for (const child of node.children) {
			traverseLeaves(child, fn)
		}
	} else {
		fn(node)
	}
}
