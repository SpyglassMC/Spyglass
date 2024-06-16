import * as core from '@spyglassmc/core'
import type { JsonArrayNode } from '../node/index.js'
import { entry } from './entry.js'

export const array: core.Parser<JsonArrayNode> = (ctx, src) =>
	core.setType(
		'json:array',
		core.list({ start: '[', value: entry, sep: ',', trailingSep: false, end: ']' }),
	)(ctx, src)
