import { Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { CompoundDefinitionNode } from '..'

export class CompoundDefinitionParser implements Parser<CompoundDefinitionNode> {
	parse(src: Source, ctx: ParserContext): CompoundDefinitionNode {
		throw new Error('Method not implemented.')
	}
}
