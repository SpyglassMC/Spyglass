import * as core from '@spyglassmc/core'
import type { JsonObjectNode } from '../node/index.js'
import { json } from './entry.js'
import { string } from './string.js'

export const object: core.InfallibleParser<JsonObjectNode> = (src, ctx) => {
	return core.setType(
		'json:object',
		core.record({
			start: '{',
			pair: {
				key: string,
				sep: ':',
				value: json,
				end: ',',
				trailingEnd: false,
			},
			end: '}',
		}),
	)(src, ctx)
}
