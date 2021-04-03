import * as core from '@spyglassmc/core'
import type { NbtCompoundNode } from '../node'
import { entry } from './entry'
import { string } from './primitive'

export const compound: core.Parser<NbtCompoundNode> = (src, ctx) => {
	const parser = core.table({
		start: '{',
		pair: { key: string, sep: ':', value: entry, end: ',', trailingEnd: false },
		end: '}',
	})
	const ans = parser(src, ctx) as core.Mutable<NbtCompoundNode>
	ans.type = 'nbt:compound'
	return ans
}
