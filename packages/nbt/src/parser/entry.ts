import * as core from '@spyglassmc/core'
import type { NbtNode } from '../node/index.js'
import { byteArray, intArray, list, longArray } from './collection.js'
import { compound } from './compound.js'
import { snbtFunction } from './function.js'
import { primitive } from './primitive.js'

const SNBT_FUNCTIONS = ['bool', 'uuid']

export const entry: core.Parser<NbtNode> = (src, ctx) =>
	core.failOnEmpty(
		core.select([
			{ predicate: (src) => src.tryPeek('[B;'), parser: byteArray },
			{
				predicate: (src) => src.tryPeek('[I;'),
				parser: intArray,
			},
			{ predicate: (src) => src.tryPeek('[L;'), parser: longArray },
			{ predicate: (src) => src.tryPeek('['), parser: list },
			{ predicate: (src) => src.tryPeek('{'), parser: compound },
			{
				predicate: (src) =>
					SNBT_FUNCTIONS.some((name) => src.string.startsWith(`${name}(`, src.cursor)),
				parser: snbtFunction(SNBT_FUNCTIONS),
			},
			{ parser: primitive },
		]),
	)(src, ctx)
