import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { EnumDefinitionNode } from '..'

function parse(src: Source, ctx: ParserContext): EnumDefinitionNode {
	throw new Error('Method not implemented.')
}

export namespace EnumDefinitionParser {
	export function create(): Parser<EnumDefinitionNode> {
		return parse
	}
}
