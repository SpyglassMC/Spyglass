import * as core from '@spyglassmc/core'
import type { NbtCompoundNode } from '../node/index.mjs'
import { entry } from './entry.mjs'

export const compound: core.InfallibleParser<NbtCompoundNode> = (src, ctx) => {
	return core.setType('nbt:compound', core.record({
		start: '{',
		pair: {
			key: core.failOnEmpty(core.string({ ...core.BrigadierStringOptions, colorTokenType: 'property' })),
			sep: ':',
			value: entry,
			end: ',',
			trailingEnd: false,
		},
		end: '}',
	}))(src, ctx)
}
