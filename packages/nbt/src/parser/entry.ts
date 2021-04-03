import * as core from '@spyglassmc/core'
import type { NbtNode } from '../node'
import { byteArray, intArray, list, longArray } from './collection'
import { compound } from './compound'
import { primitive } from './primitive'

export const entry: core.EntryParser<NbtNode> = (src, ctx) => core.any([
	primitive,
	compound,
	list,
	byteArray,
	intArray,
	longArray,
])(src, ctx)
