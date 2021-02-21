import { Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { UseClauseNode } from '..'

export class UseClauseParser implements Parser<UseClauseNode> {
	parse(src: Source, ctx: ParserContext): UseClauseNode {
		throw new Error('Method not implemented.')
	}
}
