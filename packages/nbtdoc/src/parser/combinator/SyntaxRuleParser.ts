import { CommentNode, Node, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { SyntaxRuleNode } from '../..'

interface Options<T extends Node> {
	ruleParsers: Parser<CommentNode | T>[],
}

function parse<T extends Node>({ ruleParsers }: Options<T>, src: Source, ctx: ParserContext): SyntaxRuleNode<CommentNode | T> {
	const ans: SyntaxRuleNode<CommentNode | T> = {
		type: 'nbtdoc:util/syntax',
		range: Range.create(src.cursor),
		nodes: [],
	}

	for (const parser of ruleParsers) {
		src.skipWhitespace()
		while (src.canRead() && src.peek(2) === '//') {
			const isDocComment = src.peek(3) === '///'
			const node = ctx.metaRegistry.getParser('nbtdoc:comment')(src, ctx) as CommentNode
			ans.nodes.push(node)
			if (isDocComment) {
				ctx.err.report(
					localize('nbtdoc.error.syntax.doc-comment-unexpected'),
					node.range,
				)
			}
			src.skipWhitespace()
		}

		ans.nodes.push(parser(src, ctx))
	}

	return ans
}

export namespace SyntaxRuleParser {
	export function create<T extends Node>(options: Options<T>): Parser<SyntaxRuleNode<CommentNode | T>> {
		return parse.bind(undefined, options) as Parser<SyntaxRuleNode<CommentNode | T>>
	}
}
