import * as core from '@spyglassmc/core'
import type { JsonObjectNode } from '../node'
import { entry } from './entry'
import { string } from './string'

export const object: core.InfallibleParser<JsonObjectNode> = (src, ctx) => {
	return core.setType('json:object', core.record({
		start: '{',
		pair: { key: string, sep: ':', value: entry, end: ',', trailingEnd: false },
		end: '}',
	}))(src, ctx)
}
