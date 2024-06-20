import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type {
	NbtByteArrayNode,
	NbtIntArrayNode,
	NbtListNode,
	NbtLongArrayNode,
} from '../node/index.js'
import { localizeTag } from '../util.js'
import { entry } from './entry.js'
import { primitive } from './primitive.js'

export const list: core.Parser<NbtListNode> = (src, ctx) => {
	const parser = core.list({
		start: '[',
		value: entry,
		sep: ',',
		trailingSep: true,
		end: ']',
	})
	const ans = parser(src, ctx) as NbtListNode
	ans.type = 'nbt:list'
	ans.valueType = ans.children[0]?.value?.type

	// Check if every element is of the same type.
	if (ans.valueType) {
		for (const { value } of ans.children) {
			if (value && value.type !== ans.valueType) {
				ctx.err.report(
					localize('expected-got', localizeTag(ans.valueType), localizeTag(value.type)),
					value,
				)
			}
		}
	}

	return ans
}

export const byteArray: core.Parser<NbtByteArrayNode> = (src, ctx) => {
	const parser = core.list({
		start: '[B;',
		value: primitive,
		sep: ',',
		trailingSep: true,
		end: ']',
	})
	const ans = parser(src, ctx) as NbtByteArrayNode
	ans.type = 'nbt:byte_array'

	// Check if every element is of the required type.
	for (const { value } of ans.children) {
		if (value && value.type !== 'nbt:byte') {
			ctx.err.report(
				localize('expected-got', localize('nbt.node.byte'), localizeTag(value.type)),
				value,
			)
		}
	}

	return ans
}

export const intArray: core.Parser<NbtIntArrayNode> = (src, ctx) => {
	const parser = core.list({
		start: '[I;',
		value: primitive,
		sep: ',',
		trailingSep: true,
		end: ']',
	})
	const ans = parser(src, ctx) as NbtIntArrayNode
	ans.type = 'nbt:int_array'

	// Check if every element is of the required type.
	for (const { value } of ans.children) {
		if (value && value.type !== 'nbt:int') {
			ctx.err.report(
				localize('expected-got', localize('nbt.node.int'), localizeTag(value.type)),
				value,
			)
		}
	}

	return ans
}

export const longArray: core.Parser<NbtLongArrayNode> = (src, ctx) => {
	const parser = core.list({
		start: '[L;',
		value: primitive,
		sep: ',',
		trailingSep: true,
		end: ']',
	})
	const ans = parser(src, ctx) as NbtLongArrayNode
	ans.type = 'nbt:long_array'

	// Check if every element is of the required type.
	for (const { value } of ans.children) {
		if (value && value.type !== 'nbt:long') {
			ctx.err.report(
				localize('expected-got', localize('nbt.node.long'), localizeTag(value.type)),
				value,
			)
		}
	}

	return ans
}
