import { Failure, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { Diagnostic, getLanguageService, TextDocument } from 'vscode-json-languageservice'
import { CheckerContext } from '../checker/CheckerContext'
import { loot_table } from '../checker/data/loot_table'
import { JsonAstNode } from '../node'
import { transformer } from './transformer'

const jsonLanguageService = getLanguageService({})

export const parser: Parser<JsonAstNode> = (src: Source, ctx: ParserContext) => {
	const textDocument = TextDocument.create('', 'json', 1, src.string)
	const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument)
	const diagnostics = (jsonDocument as any)['syntaxErrors'] as Diagnostic[]
	diagnostics.forEach(d => {
		const start = textDocument.offsetAt(d.range.start)
		const end = textDocument.offsetAt(d.range.end)
		ctx.err.report(d.message, Range.create(start, end))
	})
	if (jsonDocument.root === undefined) {
		return Failure
	}
	src.skipRemaining()
	const root = transformer(jsonDocument.root)

	// Temporary run checker here until checker is added to core	
	const checkerCtx = CheckerContext.create({ err: ctx.err })
	loot_table(root, checkerCtx)

	return root
}
