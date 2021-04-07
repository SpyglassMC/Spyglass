import * as core from '@spyglassmc/core'
import type { JsonObjectNode } from '../node'
import { entry } from './entry'
import { string } from './string'

export const object: core.Parser<JsonObjectNode> = (src, ctx) => {
	const parser = core.table({
		start: '{',
		pair: { key: string, sep: ':', value: entry, end: ',', trailingEnd: false },
		end: '}',
	})
	const ans = parser(src, ctx) as core.Mutable<JsonObjectNode>
	ans.type = 'json:object'
	return ans
}
