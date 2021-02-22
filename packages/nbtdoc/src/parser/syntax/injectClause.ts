import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { InjectClauseNode } from '../..'

export function injectClause(): Parser<InjectClauseNode> {
	return (src: Source, ctx: ParserContext): InjectClauseNode => {
		throw new Error('Method not implemented.')
	}
}
