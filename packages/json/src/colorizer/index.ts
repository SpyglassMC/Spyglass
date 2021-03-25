import type { ColorTokenType } from '@spyglassmc/core'
import { ColorToken, traverseLeaves } from '@spyglassmc/core'
import type { JsonAstNode } from '../node'
import { JsonPropertyAstNode } from '../node'

export function entry(root: JsonAstNode): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(root, (astNode, [parent]) => {
		const node = (astNode as JsonAstNode)
		let type: ColorTokenType | undefined
		switch(node.type) {
			case 'json:number':
				type = 'number'
				break
			case 'json:boolean':
				type = 'modifier'
				break
			case 'json:string':
				if (JsonPropertyAstNode.is(parent) && node.range.start === parent.key.range.start) {
					type = 'property'
				} else if (node.expectation?.type === 'json:string' && node.expectation.resource) {
					type = 'resourceLocation'
				} else {
					type = 'string'
				}
		}
		if (type !== undefined) {
			ans.push(ColorToken.create(node, type))
		}
	})
	return Object.freeze(ans)
}
