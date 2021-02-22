import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { DescribesClauseNode } from '../..'

export function describesClause(): Parser<DescribesClauseNode> {
	return (src: Source, ctx: ParserContext): DescribesClauseNode => {
		throw new Error('Method not implemented.')
	}
}
