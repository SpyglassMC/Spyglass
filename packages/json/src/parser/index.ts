import type { Parser, ParserContext, Source } from '@spyglassmc/core'
import { Failure } from '@spyglassmc/core'
import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import type { JsonAstNode } from '../node'
import { transformer } from './transformer'

const jsonLanguageService = getLanguageService({})

export const entry: Parser<JsonAstNode> = (src: Source, ctx: ParserContext) => {
	const textDocument = TextDocument.create('', 'json', 1, src.string)
	const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument)
	if (jsonDocument.root === undefined) {
		return Failure
	}
	src.skipRemaining()
	return transformer(jsonDocument.root)
}
