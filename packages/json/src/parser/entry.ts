import { Failure, Parser, ParserContext, Source } from '@spyglassmc/core'
import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import { JsonAstNode } from '../node'
import { schemaFromUri } from '../schema/data'
import { SchemaContext } from '../schema/SchemaContext'
import { transformer } from './transformer'

const jsonLanguageService = getLanguageService({})

export const parser: Parser<JsonAstNode> = (src: Source, ctx: ParserContext) => {
	const textDocument = TextDocument.create('', 'json', 1, src.string)
	const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument)
	if (jsonDocument.root === undefined) {
		return Failure
	}
	src.skipRemaining()
	const root = transformer(jsonDocument.root)

	// Temporary run checker here until checker is added to core
	const schemaCtx = SchemaContext.create({ err: ctx.err, roots: ctx.roots })
	const schema = schemaFromUri(ctx.doc.uri, ctx)
	schema(root, schemaCtx)

	return root
}
