import { Parser, ParserContext, Source } from '@spyglassmc/core'
import { DescribeClauseNode } from '..'

function parse(src: Source, ctx: ParserContext): DescribeClauseNode {
	throw new Error('Method not implemented.')
}

export namespace InjectClauseParser {
	export function create(): Parser<DescribeClauseNode> {
		return parse
	}
}
