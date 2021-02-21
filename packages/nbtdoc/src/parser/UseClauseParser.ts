import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { UseClauseNode } from '..'

function parse(src: Source, ctx: ParserContext): UseClauseNode {
	throw new Error('Method not implemented.')
}

export namespace UseClauseParser {
	export function create(): Parser<UseClauseNode> {
		return parse
	}
}
