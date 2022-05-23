import * as core from '@spyglassmc/core'
import type { JsonStringNode } from '../node/index.mjs'

export const JsonStringOptions: core.StringOptions = {
	escapable: {
		characters: ['b', 'f', 'n', 'r', 't'],
		unicode: true,
	},
	quotes: ['"'],
}

export const string: core.Parser<JsonStringNode> = (src, ctx) => {
	const parser = core.string(JsonStringOptions)
	const ans = parser(src, ctx) as core.Mutable<JsonStringNode | core.StringNode>
	ans.type = 'json:string'
	return ans as JsonStringNode
}
