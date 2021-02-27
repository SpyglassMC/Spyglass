import { ColorToken, ColorTokenType, traverseLeaves } from '@spyglassmc/core'
import { JsonAstNode } from '../node'

export function colorizer(node: JsonAstNode): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(node, (leaf, parents) => {
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
				} else if (node.resource) {
					type = 'resourceLocation'
				} else {
					type = 'string'
				}
		}
		if (type !== undefined) {
			ans.push(ColorToken.create(leaf, type))
		}
	})
	return Object.freeze(ans)
}
