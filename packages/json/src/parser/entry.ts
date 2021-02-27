import { Failure, Parser, ParserContext, Range, Source } from '@spyglassmc/core'
import { getLanguageService, TextDocument, Diagnostic } from 'vscode-json-languageservice'
import { JsonAstNode } from '../node'
import { transformer } from './transformer'

const jsonLanguageService = getLanguageService({})

export const entry: Parser<JsonAstNode> = (src: Source, ctx: ParserContext) => {
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
	return transformer(jsonDocument.root)
}
