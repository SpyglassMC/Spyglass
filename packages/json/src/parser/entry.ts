import * as core from '@spyglassmc/core'
import type { JsonNode } from '../node'
import { array } from './array'
import { boolean } from './boolean'
import { null_ } from './null'
import { number } from './number'
import { object } from './object'
import { string } from './string'

export function json(dumpErrors = false): core.Parser<JsonNode> {
	return (src, ctx) => {
		const result = core.any([
			string,
			number,
			boolean,
			null_,
			object,
			array,
		])(src, ctx)

		if (dumpErrors) {
			ctx.err.dump()
		}
		return result
	}
}

export const entry: core.Parser<JsonNode> = json(true)
