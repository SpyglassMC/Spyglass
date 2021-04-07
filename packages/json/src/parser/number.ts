import * as core from '@spyglassmc/core'
import type { JsonNumberNode } from '../node'

export const number: core.Parser<JsonNumberNode> = (src, ctx) => {
	const parser = core.float({
		pattern: /./,
	})
	const ans = parser(src, ctx) as core.Mutable<core.FloatNode | JsonNumberNode>
	ans.type = 'json:number'
	return ans as JsonNumberNode
}
