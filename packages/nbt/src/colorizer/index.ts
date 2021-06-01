import type { Colorizer, MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { NbtByteNode, NbtCompoundNode, NbtDoubleNode, NbtFloatNode, NbtIntNode, NbtLongNode, NbtShortNode } from '../node'

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

export function register(meta: MetaRegistry) {
	meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
	meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
	meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
	meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
	meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
	meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
	meta.registerColorizer<NbtCompoundNode>('nbt:compound', compound)
}
