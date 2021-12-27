import * as core from '@spyglassmc/core'
import type { LiteralNode, SpyglassmcTrailingArgumentNode } from '../node'

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<LiteralNode>('mcfunction:literal', core.colorizer.literal)
	meta.registerColorizer<SpyglassmcTrailingArgumentNode>('mcfunction:argument/spyglassmc:trailing', core.colorizer.error)
}
