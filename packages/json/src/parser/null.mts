import * as core from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import type { JsonNullNode } from '../node/index.mjs'

export const null_: core.Parser<JsonNullNode> = (src, ctx) => {
	const start = src.cursor
	if (src.trySkip('null')) {
		return {
			type: 'json:null',
			range: Range.create(start, src),
		}
	}
	return core.Failure
}
