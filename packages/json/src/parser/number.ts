import * as core from '@spyglassmc/core'
import type { JsonNumberNode } from '../node/index.js'

export const number: core.Parser<JsonNumberNode> = (src, ctx) => {
	const value = core.select([
		{
			regex: /^-?(?:0|[1-9]\d*)(?!\d|[.eE])/,
			parser: core.long({
				pattern: /^-?(?:0|[1-9]\d*)$/,
			}),
		},
		{
			parser: core.float({
				// Regex form of the chart from https://www.json.org.
				pattern: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/,
			}),
		},
	])(src, ctx)

	return {
		type: 'json:number',
		children: [value],
		value: value,
		range: value.range,
	}
}
