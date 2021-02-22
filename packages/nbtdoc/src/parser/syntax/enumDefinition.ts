import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { EnumDefinitionNode } from '../..'

export function enumDefinition(): Parser<EnumDefinitionNode> {
	return (src: Source, ctx: ParserContext): EnumDefinitionNode => {
		throw new Error('Method not implemented.')
	}
}
