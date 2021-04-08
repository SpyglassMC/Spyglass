import * as core from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import type { JsonNullNode } from '../node'

export const null_: core.Parser<JsonNullNode> = (src, ctx) => {
	if (src.trySkip('null')) {
		return {
			type: 'json:null',
			range: Range.create(src.cursor - 4, src),
		}
	}
	return core.Failure
}
