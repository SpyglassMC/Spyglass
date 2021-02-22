import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { UseClauseNode } from '..'

export namespace useClause {
	export function create(): Parser<UseClauseNode> {
		return (src: Source, ctx: ParserContext): UseClauseNode => {
			throw new Error('Method not implemented.')
		}
	}
}
