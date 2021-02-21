import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { CompoundDefinitionNode } from '..'

function parse(src: Source, ctx: ParserContext): CompoundDefinitionNode {
	throw new Error('Method not implemented.')
}

export namespace CompoundDefinitionParser {
	export function create(): Parser<CompoundDefinitionNode> {
		return parse
	}
}
