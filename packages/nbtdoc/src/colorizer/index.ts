import { ColorToken, ColorTokenType, traverseLeaves } from '@spyglassmc/core'
import { LeafNode, MainNode } from '../node'

export namespace colorizer {
	export function entry(node: Readonly<MainNode>): readonly ColorToken[] {
		const ans: ColorToken[] = []
		traverseLeaves(node, leaf => {
			let type: ColorTokenType | undefined
			switch ((leaf as LeafNode).type) {
				case 'comment':
					type = 'comment'
					break
				case 'nbtdoc:compound_definition/field/type':
					type = 'type'
					break
				case 'nbtdoc:float':
					type = 'number'
					break
				case 'nbtdoc:identifier':
					type = 'property' // FIXME
					break
				case 'nbtdoc:integer':
					type = 'number'
					break
				case 'nbtdoc:literal':
					type = 'keyword' // FIXME
					break
				case 'nbtdoc:minecraft_identifier':
					type = 'resourceLocation'
					break
				case 'nbtdoc:string':
					type = 'string'
					break
				default:
					break
			}
			if (type !== undefined) {
				ans.push(ColorToken.create(leaf, type))
			}
		})
		return Object.freeze(ans)
	}
}
