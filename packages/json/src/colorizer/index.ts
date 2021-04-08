import type { Colorizer } from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { JsonBooleanNode, JsonNullNode, JsonObjectNode } from '../node'

export const boolean: Colorizer<JsonBooleanNode> = node => {
	return [ColorToken.create(node, 'literal')]
}

export const null_: Colorizer<JsonNullNode> = node => {
	return [ColorToken.create(node, 'literal')]
}

export const object: Colorizer<JsonObjectNode> = (node, ctx) => {
	const ans: ColorToken[] = []
	for (const pair of node.children) {
		if (pair.key) {
			ans.push(ColorToken.create(pair.key, 'property'))
		}
		if (pair.value) {
			const colorizer = ctx.meta.getColorizer(pair.value.type)
			ans.push(...colorizer(pair.value, ctx))
		}
	}
	return ans
}
