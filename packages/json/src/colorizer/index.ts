import type { Colorizer, MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type {
	JsonBooleanNode,
	JsonNullNode,
	JsonNumberNode,
	JsonObjectNode,
	JsonStringNode,
} from '../node/index.js'

export const boolean: Colorizer<JsonBooleanNode> = (node) => {
	return [ColorToken.create(node, 'literal')]
}

export const null_: Colorizer<JsonNullNode> = (node) => {
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

export const string: Colorizer<JsonStringNode> = (node, ctx) => {
	// Children may include a mix of `UnicodeEscapeNode` siblings (for hover
	// diagnostics) and the value-parser result (e.g. the SNBT tree inside a
	// `#[nbt]` string). Delegate to every child that owns a colorizer, then
	// fill the remaining range with the string color so unescaped segments
	// and the wrapping quotes still read as a string.
	if (node.children && node.children.length > 0) {
		const tokens: ColorToken[] = []
		for (const child of node.children) {
			if (!ctx.meta.hasColorizer(child.type)) {
				continue
			}
			tokens.push(...ctx.meta.getColorizer(child.type)(child, ctx))
		}
		if (tokens.length) {
			return ColorToken.fillGap(tokens, node.range, node.options.colorTokenType ?? 'string')
		}
	}
	return [ColorToken.create(node, node.options.colorTokenType ?? 'string')]
}

export function register(meta: MetaRegistry): void {
	meta.registerColorizer<JsonBooleanNode>('json:boolean', boolean)
	meta.registerColorizer<JsonNullNode>('json:null', null_)
	meta.registerColorizer<JsonNumberNode>('json:number', core.colorizer.number)
	meta.registerColorizer<JsonObjectNode>('json:object', object)
	meta.registerColorizer<JsonStringNode>('json:string', string)
}
