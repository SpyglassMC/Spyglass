import * as core from '@spyglassmc/core'
import type { LiteralNode, SpyglassmcTrailingArgumentNode } from '../node'

export const literal: core.Colorizer<LiteralNode> = node => {
	return [core.ColorToken.create(node, node.isRoot ? 'keyword' : 'literal')]
}

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<LiteralNode>('mcfunction:literal', literal)
	meta.registerColorizer<SpyglassmcTrailingArgumentNode>('mcfunction:argument/spyglassmc:trailing', core.colorizer.error)
}
