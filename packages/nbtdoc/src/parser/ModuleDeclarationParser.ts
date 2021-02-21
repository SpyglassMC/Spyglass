import { CommentNode, ErrorSeverity, MetaRegistry, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { IdentifierToken, KeywordToken, ModuleDeclarationNode } from '..'
import { SyntaxRuleNode } from '../node'
import { SyntaxRuleParser } from './combinator'

type CombinedParser = Parser<SyntaxRuleNode<CommentNode | KeywordToken | IdentifierToken>>

function parse(src: Source, ctx: ParserContext): ModuleDeclarationNode {
	const start = src.cursor
	const ans: ModuleDeclarationNode = {
		type: 'nbtdoc:module_declaration',
		range: Range.create(start),
		nodes: [],
	}

	const parser = getCombinedParser(ctx.metaRegistry)
	ans.nodes = parser(src, ctx).nodes

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

let combinedParser: CombinedParser

function getCombinedParser(registry: MetaRegistry): CombinedParser {
	if (!combinedParser) {
		combinedParser = SyntaxRuleParser.create({
			ruleParsers: [
				registry.getParser('nbtdoc:keyword/mod'),
				registry.getParser('nbtdoc:identifier'),
				registry.getParser('nbtdoc:keyword/;'),
			],
		}) as any
	}
	return combinedParser
}

export namespace ModuleDeclarationParser {
	export function create(): Parser<ModuleDeclarationNode> {
		return parse
	}
}
