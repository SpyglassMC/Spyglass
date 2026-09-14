import type * as core from '@spyglassmc/core'
import { registerNBT } from './nbt.js'
import { unicodeEscapes } from './string.js'

export function register(meta: core.MetaRegistry) {
	registerNBT(meta)

	meta.registerChecker<core.StringNode>('string', unicodeEscapes)
	meta.registerChecker<core.StringBaseNode>('json:string', unicodeEscapes)
}

export * from './nbt.js'
export * from './string.js'
