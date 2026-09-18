import type { MetaRegistry } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type {
	NbtBoolFunctionNode,
	NbtByteNode,
	NbtCompoundNode,
	NbtDoubleNode,
	NbtFloatNode,
	NbtFunctionNode,
	NbtIntNode,
	NbtLongNode,
	NbtShortNode,
	NbtStringNode,
	NbtUuidFunctionNode,
	TypedNbtNode,
} from '../node/index.js'

const snbtFunction: core.Colorizer<NbtFunctionNode> = (node) => {
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
			tokens.push(ColorToken.create(pair.sep, 'punctuation'))
		}
		if (pair.value) {
			tokens.push(...ctx.meta.getColorizer(pair.value.type)(pair.value, ctx))
		}
		if (pair.end) {
			tokens.push(ColorToken.create(pair.end, 'punctuation'))
		}
	}
	return tokens
}

const typed: core.Colorizer<TypedNbtNode> = (node, ctx) => {
	const child = node.children[0]
	return ctx.meta.getColorizer(child.type)(child, ctx)
}

export function register(meta: MetaRegistry) {
	meta.registerColorizer<NbtStringNode>('nbt:string', core.colorizer.string)
	meta.registerColorizer<NbtByteNode>('nbt:byte', core.colorizer.number)
	meta.registerColorizer<NbtShortNode>('nbt:short', core.colorizer.number)
	meta.registerColorizer<NbtIntNode>('nbt:int', core.colorizer.number)
	meta.registerColorizer<NbtLongNode>('nbt:long', core.colorizer.number)
	meta.registerColorizer<NbtFloatNode>('nbt:float', core.colorizer.number)
	meta.registerColorizer<NbtDoubleNode>('nbt:double', core.colorizer.number)
	meta.registerColorizer<NbtBoolFunctionNode>('nbt:bool_function', snbtFunction)
	meta.registerColorizer<NbtUuidFunctionNode>('nbt:uuid_function', snbtFunction)
	meta.registerColorizer<NbtCompoundNode>('nbt:compound', compound)
	meta.registerColorizer<TypedNbtNode>('nbt:typed', typed)
}
