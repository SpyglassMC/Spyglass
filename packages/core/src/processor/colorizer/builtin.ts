import type { ResourceLocationNode } from '../../node'
import type { Colorizer, ColorTokenType } from './Colorizer'
import { ColorToken } from './Colorizer'

export const resourceLocation: Colorizer<ResourceLocationNode> = (node, ctx) => {
	let type: ColorTokenType
	switch (node.category) {
		case 'function':
		case 'tag/function':
			type = 'function'
			break
		default:
			type = 'resourceLocation'
			break
	}
	return [ColorToken.create(node, type)]
}
