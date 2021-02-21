import { MetaRegistry, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { MainNode } from '..'
import { ContentNode } from '../node'

function parse(src: Source, ctx: ParserContext): MainNode {
	const start = src
		.skipWhitespace()
		.cursor
	const ans: MainNode = {
		type: 'nbtdoc:main',
		range: Range.create(start),
		nodes: [],
	}
	while (src.canRead()) {
		const result = parseWithSubParser(ans, src, ctx)
		if (!result) {
			ctx.err.report(
				localize('nbtdoc.error.main.unknown-syntax'),
				ans.range
			)
			src.nextLine()
		}
	}
	ans.range = Range.create(start, src.cursor)
	return ans
}

/**
 * @returns If any sub parser has parsed successfully.
 */
function parseWithSubParser(ans: MainNode, src: Source, ctx: ParserContext): boolean {
	const start = src
		.skipWhitespace()
		.cursor
	for (const parser of ensureSubParsers(ctx.metaRegistry)) {
		if (ctx.err.attempt(
			() => ans.nodes.push(parser(src, ctx))
		)) {
			return true
		}
		src.cursor = start
	}
	return false
}

let SubParsers: Parser<ContentNode>[]

function ensureSubParsers(registry: MetaRegistry): Parser<ContentNode>[] {
	if (!SubParsers) {
		SubParsers = [
			registry.getParser('nbtdoc:comment'),
			registry.getParser('nbtdoc:compound_definition'),
			registry.getParser('nbtdoc:describe_clause'),
			registry.getParser('nbtdoc:enum_definition'),
			registry.getParser('nbtdoc:inject_clause'),
			registry.getParser('nbtdoc:module_declaration'),
			registry.getParser('nbtdoc:use_clause'),
		] as any
	}
	return SubParsers
}

export namespace MainParser {
	export function create(): Parser<MainNode> {
		return parse
	}
}
