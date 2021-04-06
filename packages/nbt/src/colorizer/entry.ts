import type { ColorTokenType, PairNode, StringNode } from '@spyglassmc/core'
import { ColorToken, traverseLeaves } from '@spyglassmc/core'
import type { NbtNode } from '../node'

export function entry(root: NbtNode): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(root, (astNode, [parent]) => {
		const node = (astNode as NbtNode)
		let type: ColorTokenType | undefined
		switch(node.type) {
			case 'string':
				if (parent.type === 'pair' && node.range.start === (parent as PairNode<StringNode, NbtNode>).key?.range.start) {
					type = 'property'
				} else {
					type = 'string'
				}
				break
			case 'nbt:byte':
			case 'nbt:short':
			case 'nbt:int':
			case 'nbt:long':
			case 'nbt:float':
			case 'nbt:double':
				type = 'number'
				break
		}
		if (type !== undefined) {
			ans.push(ColorToken.create(node, type))
		}
	})
	return Object.freeze(ans)
}
