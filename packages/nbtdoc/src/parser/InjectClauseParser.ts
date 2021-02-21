import { Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { InjectClauseNode } from '..'

export class InjectClauseParser implements Parser<InjectClauseNode> {
	parse(src: Source, ctx: ParserContext): InjectClauseNode {
		throw new Error('Method not implemented.')
	}
}
