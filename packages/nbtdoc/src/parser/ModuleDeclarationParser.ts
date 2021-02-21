import { CommentNode, ErrorSeverity, MetaRegistry, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { IdentifierToken, KeywordToken, ModuleDeclarationNode } from '..'
import { SyntaxParser } from './util'

type SubParser = SyntaxParser<CommentNode | KeywordToken | IdentifierToken>

export class ModuleDeclarationParser implements Parser<ModuleDeclarationNode> {
	private static subParser: SubParser

	public parse(src: Source, ctx: ParserContext): ModuleDeclarationNode {
		const start = src.cursor
		const ans: ModuleDeclarationNode = {
			type: 'nbtdoc:module_declaration',
			range: Range.create(start),
			nodes: [],
		}

		const parser = ModuleDeclarationParser.ensureSubParser(ctx.metaRegistry)
		ans.nodes = parser.parse(src, ctx).nodes

		//#region Set `identifier` and report potential `Fatal` errors.
		let hasModKeyword = false
		let identifier: IdentifierToken | undefined
		for (const node of ans.nodes) {
			if (node.type === 'nbtdoc:keyword' && node.text === 'mod') {
				hasModKeyword = true
			} else if (node.type === 'nbtdoc:identifier') {
				identifier = node
			}
		}

		if (!hasModKeyword) {
			ctx.err.report(
				localize('nbtdoc.error.module-declaration.fatal', [
					localize('punc.quote', ['mod']),
				]),
				ans.range,
				ErrorSeverity.Fatal
			)
		}
		ans.identifier = identifier
		//#endregion

		ans.range = Range.create(start, src.cursor)

		return ans
	}

	private static ensureSubParser(registry: MetaRegistry): SubParser {
		if (!this.subParser) {
			const CSyntax = registry.getParser('nbtdoc:util/syntax')
			const CKeyword = registry.getParser('nbtdoc:keyword')
			const CIdentifier = registry.getParser('nbtdoc:identifier')
			this.subParser = new CSyntax([
				new CKeyword('mod'),
				new CIdentifier(),
				new CKeyword(';', true),
			]) as any
		}
		return this.subParser
	}
}
