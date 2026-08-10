import type { MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type {
	NbtBinNode,
	NbtBoolNode,
	NbtByteNode,
	NbtCompoundNode,
	NbtDoubleNode,
	NbtFloatNode,
	NbtHexNode,
	NbtIntNode,
	NbtLongNode,
	NbtShortNode,
	NbtSnbtFunctionNode,
	NbtStringNode,
	NbtUuidNode,
} from '../node/index.js'

type NbtRadixNode = NbtHexNode | NbtBinNode

const radix: core.Colorizer<NbtRadixNode> = (node) => {
	return [
		ColorToken.create(node.prefixRange, 'escape'),
		ColorToken.create(core.Range.create(node.prefixRange.end, node.range.end), 'number'),
	]
}

const snbtFunction: core.Colorizer<NbtSnbtFunctionNode> = (node) => {
	return [
		ColorToken.create(
			core.Range.create(node.prefixRange.start, node.prefixRange.start + 4),
			'function',
		),
		ColorToken.create(
			core.Range.create(node.prefixRange.start + 4, node.prefixRange.end),
			'operator',
		),
		ColorToken.create(node.suffixRange, 'operator'),
	]
}

const compound: core.Colorizer<NbtCompoundNode> = (node, ctx) => {
	const tokens: ColorToken[] = []
	for (const pair of node.children) {
		if (pair.key) {
			tokens.push(...ctx.meta.getColorizer(pair.key.type)(pair.key, ctx))
		}
		if (pair.sep) {
			tokens.push(ColorToken.create(pair.sep, 'operator'))
		}
		if (pair.value) {
			tokens.push(...ctx.meta.getColorizer(pair.value.type)(pair.value, ctx))
		}
		if (pair.end) {
			tokens.push(ColorToken.create(pair.end, 'operator'))
		}
	}
	return tokens
}

export function register(meta: MetaRegistry) {
	meta.registerColorizer<NbtStringNode>('nbt:string', core.colorizer.string)
	meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
	meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
	meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
	meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
	meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
	meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
	meta.registerColorizer<NbtHexNode>('nbt:hex', radix)
	meta.registerColorizer<NbtBinNode>('nbt:bin', radix)
	meta.registerColorizer<NbtBoolNode>('nbt:bool', snbtFunction)
	meta.registerColorizer<NbtUuidNode>('nbt:uuid', snbtFunction)
	meta.registerColorizer<NbtCompoundNode>('nbt:compound', compound)
}
