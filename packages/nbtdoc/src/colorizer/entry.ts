import type { ColorizerContext, ColorTokenType } from '@spyglassmc/core'
import { ColorToken, traverseLeaves } from '@spyglassmc/core'
import type { LeafNode, MainNode } from '../node'

export function entry(node: MainNode, ctx: ColorizerContext): readonly ColorToken[] {
	const ans: ColorToken[] = []
	traverseLeaves(node, leaf => {
		let type: ColorTokenType | undefined
		switch ((leaf as LeafNode).type) {
			case 'comment':
				type = 'comment'
				break
			case 'float':
			case 'integer':
				type = 'number'
				break
			case 'string':
				type = 'string'
				break
			case 'nbtdoc:compound_definition/field/type':
				type = 'type'
				break
			case 'nbtdoc:identifier':
				type = 'property' // FIXME
				break
			case 'nbtdoc:literal':
				type = 'keyword'
				break
			case 'nbtdoc:minecraft_identifier':
				type = 'resourceLocation'
				break
		}
		if (type !== undefined) {
			ans.push(ColorToken.create(leaf, type))
		}
	}, ctx.options.range)
	return Object.freeze(ans)
}
