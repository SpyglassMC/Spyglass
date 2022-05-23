import type { Colorizer, MetaRegistry } from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { IdentifierNode, LiteralNode } from '../node/index.js'

export const identifier: Colorizer<IdentifierNode> = node => {
	return [ColorToken.create(node, 'variable')]
}

export const literal: Colorizer<LiteralNode> = node => {
	return [ColorToken.create(node, node.colorTokenType ?? 'literal')]
}

export function registerMcdocColorizer(meta: MetaRegistry) {
	meta.registerColorizer<LiteralNode>('mcdoc:literal', literal)
	meta.registerColorizer<IdentifierNode>('mcdoc:identifier', identifier)
}
