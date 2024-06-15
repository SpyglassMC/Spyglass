import * as core from '@spyglassmc/core'
import type { NbtCompoundNode } from '../node/index.js'
import { entry } from './entry.js'

export const compound: core.InfallibleParser<NbtCompoundNode> = (src, ctx) => {
	return core.setType(
		'nbt:compound',
		core.record({
			start: '{',
			pair: {
				key: core.failOnEmpty(
					core.setType(
						'nbt:string',
						core.string({
							...core.BrigadierStringOptions,
							colorTokenType: 'property',
						}),
					),
				),
				sep: ':',
				value: entry,
				end: ',',
				trailingEnd: false,
			},
			end: '}',
		}),
	)(src, ctx)
}
