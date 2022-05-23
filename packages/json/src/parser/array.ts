import * as core from '@spyglassmc/core'
import type { JsonArrayNode } from '../node/index.js'
import { entry } from './entry.js'

export const array: core.Parser<JsonArrayNode> = (src, ctx) => {
	const parser = core.list({
		start: '[',
		value: entry,
		sep: ',',
		trailingSep: false,
		end: ']',
	})
	const ans = parser(src, ctx) as core.Mutable<JsonArrayNode>
	ans.type = 'json:array'
	return ans
}
