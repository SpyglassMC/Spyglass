import { CommentNode, MetaRegistry, Node, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { SyntaxNode } from '../..'

type CommentParser = Parser<CommentNode>

export class SyntaxParser<T extends Node> implements Parser<SyntaxNode<(CommentNode | T)>> {
	private static commentParser: CommentParser

	constructor(
		private readonly subParsers: Parser<T>[]
	) { }

	public parse(src: Source, ctx: ParserContext): SyntaxNode<(CommentNode | T)> {
		const ans: SyntaxNode<(CommentNode | T)> = {
			type: 'nbtdoc:util/syntax',
			range: Range.create(src.cursor),
			nodes: [],
		}

		for (const parser of this.subParsers) {
			src.skipWhitespace()
			while (src.canRead() && src.peek(2) === '//') {
				const isDocComment = src.peek(3) === '///'
				const node = SyntaxParser.ensureCommentParser(ctx.metaRegistry).parse(src, ctx)
				ans.nodes.push(node)
				if (isDocComment) {
					ctx.err.report(
						localize('nbtdoc.error.syntax.doc-comment-unexpected'),
						node.range,
					)
				}
				src.skipWhitespace()
			}

			ans.nodes.push(parser.parse(src, ctx))
		}

		return ans
	}

	private static ensureCommentParser(registry: MetaRegistry): CommentParser {
		if (!SyntaxParser.commentParser) {
			const CParser = registry.getParser('comment')
			SyntaxParser.commentParser = new CParser(new Set(['//'])) as any
		}
		return SyntaxParser.commentParser
	}
}
