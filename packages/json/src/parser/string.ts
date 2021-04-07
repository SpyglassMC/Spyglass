import * as core from '@spyglassmc/core'
import type { JsonStringNode } from '../node'

export const string: core.Parser<JsonStringNode> = (src, ctx) => {
	const parser = core.string({
		escapable: {
			characters: ['b', 'f', 'n', 'r', 't'],
			unicode: true,
		},
		quotes: ['"'],
	})
	const ans = parser(src, ctx) as core.Mutable<JsonStringNode | core.StringNode>
	ans.type = 'json:string'
	return ans as JsonStringNode
}
