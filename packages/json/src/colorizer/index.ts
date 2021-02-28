import { ColorToken, ColorTokenType, traverseLeaves } from '@spyglassmc/core'
import { JsonAstNode, JsonStringAstNode } from '../node'

export function colorizer(root: JsonAstNode): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(root, (node, parents) => {
		let type: ColorTokenType | undefined
		switch(node.type) {
			case 'json:number':
				type = 'number'
				break
			case 'json:boolean':
				type = 'number'
				break
			case 'json:string':
				const p = parents[parents.length - 1] as JsonAstNode
				if (p.type === 'json:property' && node.range.start === p.key.range.start) {
					type = 'property'
				} else if ((node as JsonStringAstNode).resource) {
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
