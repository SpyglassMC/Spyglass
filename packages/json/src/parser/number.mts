import * as core from '@spyglassmc/core'
import type { JsonNumberNode } from '../node/index.mjs'

export const number: core.Parser<JsonNumberNode> = (src, ctx) => {
	const parser = core.float({
		// Regex form of the chart from https://www.json.org.
		pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/,
	})
	const ans = parser(src, ctx) as core.Mutable<core.FloatNode | JsonNumberNode>
	ans.type = 'json:number'
	return ans as JsonNumberNode
}
