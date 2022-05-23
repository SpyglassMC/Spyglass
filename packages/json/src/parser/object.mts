import * as core from '@spyglassmc/core'
import type { JsonObjectNode } from '../node/index.mjs'
import { entry } from './entry.mjs'
import { string } from './string.mjs'

export const object: core.InfallibleParser<JsonObjectNode> = (src, ctx) => {
	return core.setType('json:object', core.record({
		start: '{',
		pair: { key: string, sep: ':', value: entry, end: ',', trailingEnd: false },
		end: '}',
	}))(src, ctx)
}
