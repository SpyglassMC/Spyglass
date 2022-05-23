import type { Colorizer, MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { JsonBooleanNode, JsonNullNode, JsonNumberNode, JsonObjectNode, JsonStringNode } from '../node/index.js'

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

export function register(meta: MetaRegistry): void {
	meta.registerColorizer<JsonBooleanNode>('json:boolean', boolean)
	meta.registerColorizer<JsonNullNode>('json:null', null_)
	meta.registerColorizer<JsonNumberNode>('json:number', core.colorizer.number)
	meta.registerColorizer<JsonObjectNode>('json:object', object)
	meta.registerColorizer<JsonStringNode>('json:string', core.colorizer.string)
}
