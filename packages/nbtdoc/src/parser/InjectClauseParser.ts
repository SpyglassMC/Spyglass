import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { DescribesClauseNode } from '..'

function parse(src: Source, ctx: ParserContext): DescribesClauseNode {
	throw new Error('Method not implemented.')
}

export namespace InjectClauseParser {
	export function create(): Parser<DescribesClauseNode> {
		return parse
	}
}
