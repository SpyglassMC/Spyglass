import * as core from '@spyglassmc/core'
import type { JsonNode } from '../node'
import { array } from './array'
import { boolean } from './boolean'
import { null_ } from './null'
import { number } from './number'
import { object } from './object'
import { string } from './string'

export const entry: core.Parser<JsonNode> = (src, ctx) => {
	const result = core.any([
		string,
		number,
		boolean,
		null_,
		object,
		array,
	])(src, ctx)

	ctx.err.dump()
	return result
}
