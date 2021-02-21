import { CommentNode, Node, Parser, ParserContext, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'

interface Options<T extends Node> {
	ruleParsers: Parser<CommentNode | T>[],
}

function parse<T extends Node>({ ruleParsers }: Options<T>, src: Source, ctx: ParserContext): (CommentNode | T)[] {
	const ans: (CommentNode | T)[] = []

	for (const parser of ruleParsers) {
		src.skipWhitespace()
		while (src.canRead() && src.peek(2) === '//') {
			const isDocComment = src.peek(3) === '///'
			const node = ctx.metaRegistry.getParser('nbtdoc:comment')(src, ctx) as CommentNode
			ans.push(node)
			if (isDocComment) {
				ctx.err.report(
					localize('nbtdoc.error.syntax.doc-comment-unexpected'),
					node.range,
				)
			}
			src.skipWhitespace()
		}

		ans.push(parser(src, ctx))
	}

	return ans
}

export namespace SyntaxRuleParser {
	export function create<T extends Node>(options: Options<T>): Parser<(CommentNode | T)[]> {
		return parse.bind(undefined, options) as Parser<(CommentNode | T)[]>
	}
}
