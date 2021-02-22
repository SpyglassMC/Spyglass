import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { CompoundDefinitionNode } from '../..'

export function compoundDefinition(): Parser<CompoundDefinitionNode> {
	return (src: Source, ctx: ParserContext): CompoundDefinitionNode => {
		throw new Error('Method not implemented.')
	}
}
