import { Failure, Parser, ParserContext, Source } from '@spyglassmc/core'
import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import { CheckerContext } from '../checker/CheckerContext'
import { checkerFromUri } from '../checker/data'
import { JsonAstNode } from '../node'
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
	const checkerCtx = CheckerContext.create({ err: ctx.err })
	const checker = checkerFromUri(ctx.doc.uri)
	checker(root, checkerCtx)

	return root
}
