import { AstNode, ColorToken, ColorTokenType } from '@spyglassmc/core'
import { JsonAstNode, JsonNumberAstNode, JsonPropertyAstNode, JsonStringAstNode } from '../node'

export function colorizer(node: JsonAstNode): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(node, (leaf, isProperty) => {
		let type: ColorTokenType | undefined
		if (isProperty) {
			type = 'property'
		} else if (JsonStringAstNode.is(leaf)) {
			type = leaf.resource ? 'resourceLocation' : 'string'
		} else if (JsonNumberAstNode.is(leaf)) {
			type = 'number'
		}
		if (type !== undefined) {
			ans.push(ColorToken.create(leaf, type))
		}
	})
	return Object.freeze(ans)
}

function traverseLeaves(node: AstNode, fn: (this: void, leaf: AstNode, isProperty: boolean) => unknown) {
	if (JsonPropertyAstNode.is(node)) {
		fn(node, true)
		if (node.value) {
			traverseLeaves(node.value, fn)
		}
	} else if (node.children) {
		for (const child of node.children) {
			traverseLeaves(child, fn)
		}
	} else {
		fn(node, false)
	}
}
