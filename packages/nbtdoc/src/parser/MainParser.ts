import { MetaRegistry, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { MainNode } from '..'
import { ContentNode } from '../node'

export class MainParser implements Parser<MainNode> {
	private static SubParsers: Parser<ContentNode>[]

	public parse(src: Source, ctx: ParserContext): MainNode {
		const start = src
			.skipWhitespace()
			.cursor
		const ans: MainNode = {
			type: 'nbtdoc:main',
			range: Range.create(start),
			nodes: [],
		}
		while (src.canRead()) {
			const result = this.parseWithSubParser(ans, src, ctx)
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
	private parseWithSubParser(ans: MainNode, src: Source, ctx: ParserContext): boolean {
		const start = src
			.skipWhitespace()
			.cursor
		for (const parser of MainParser.ensureSubParsers(ctx.metaRegistry)) {
			if (ctx.err.attempt(
				() => ans.nodes.push(parser.parse(src, ctx))
			)) {
				return true
			}
			src.cursor = start
		}
		return false
	}

	private static ensureSubParsers(registry: MetaRegistry): Parser<ContentNode>[] {
		if (!MainParser.SubParsers) {
			const comment = registry.getParser('comment')
			const compoundDefinition = registry.getParser('nbtdoc:compound_definition')
			const describeClause = registry.getParser('nbtdoc:describe_clause')
			const enumDefinition = registry.getParser('nbtdoc:enum_definition')
			const injectClause = registry.getParser('nbtdoc:inject_clause')
			const moduleDeclaration = registry.getParser('nbtdoc:module_declaration')
			const useClause = registry.getParser('nbtdoc:use_clause')
			MainParser.SubParsers = [
				new comment(new Set(['//'])),
				new compoundDefinition(),
				new describeClause(),
				new enumDefinition(),
				new injectClause(),
				new moduleDeclaration(),
				new useClause(),
			] as any
		}
		return MainParser.SubParsers
	}
}
