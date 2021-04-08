import * as core from '@spyglassmc/core'
import { Range } from '@spyglassmc/core'
import type { JsonBooleanNode } from '../node'

export const boolean: core.Parser<JsonBooleanNode> = (src, ctx) => {
	if (src.trySkip('false')) {
		return {
			type: 'json:boolean',
			range: Range.create(src.cursor - 5, src),
			value: false,
		}
	}
	if (src.trySkip('true')) {
		return {
			type: 'json:boolean',
			range: Range.create(src.cursor - 4, src),
			value: true,
		}
	}
	return core.Failure
}
