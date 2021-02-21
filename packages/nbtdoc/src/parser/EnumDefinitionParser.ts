import { Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { EnumDefinitionNode } from '..'

export class EnumDefinitionParser implements Parser<EnumDefinitionNode> {
	parse(src: Source, ctx: ParserContext): EnumDefinitionNode {
		throw new Error('Method not implemented.')
	}
}
