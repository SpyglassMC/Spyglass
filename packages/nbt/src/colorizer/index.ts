import type { Colorizer } from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { NbtCompoundNode } from '../node'

export const compound: Colorizer<NbtCompoundNode> = (node, ctx) => {
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
