import { Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { DescribeClauseNode } from '..'

export class DescribeClauseParser implements Parser<DescribeClauseNode> {
	parse(src: Source, ctx: ParserContext): DescribeClauseNode {
		throw new Error('Method not implemented.')
	}
}
