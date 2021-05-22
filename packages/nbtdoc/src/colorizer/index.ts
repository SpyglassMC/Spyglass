import type { Colorizer, ResourceLocationNode } from '@spyglassmc/core'
import { ColorToken } from '@spyglassmc/core'
import type { CompoundFieldTypeNode, IdentifierToken, LiteralToken } from '../node'

export const compoundFieldType: Colorizer<CompoundFieldTypeNode> = node => {
	return [ColorToken.create(node, 'type')]
}

export const identifier: Colorizer<IdentifierToken> = node => {
	return [ColorToken.create(node, 'property')] // FIXME
}

export const literal: Colorizer<LiteralToken> = node => {
	return [ColorToken.create(node, 'keyword')]
}
