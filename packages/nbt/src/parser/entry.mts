import * as core from '@spyglassmc/core'
import type { NbtNode } from '../node/index.mjs'
import { byteArray, intArray, list, longArray } from './collection.mjs'
import { compound } from './compound.mjs'
import { primitive } from './primitive.mjs'

export const entry: core.Parser<NbtNode> = (src, ctx) => core.failOnEmpty(core.select([
	{ predicate: src => src.tryPeek('[B;'), parser: byteArray },
	{ predicate: src => src.tryPeek('[I;'), parser: intArray },
	{ predicate: src => src.tryPeek('[L;'), parser: longArray },
	{ predicate: src => src.tryPeek('['), parser: list },
	{ predicate: src => src.tryPeek('{'), parser: compound },
	{ parser: primitive },
]))(src, ctx)
