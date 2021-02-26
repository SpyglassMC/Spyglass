import { InfallibleParser, Range, Source } from '@spyglassmc/core'
import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import { JsonAstNode } from '../node'
import { transformer } from './transformer'

const jsonLanguageService = getLanguageService({})

export const entry: InfallibleParser<JsonAstNode> = (src: Source) => {
  const textDocument = TextDocument.create('', 'json', 1, src.string)
  const jsonDocument = jsonLanguageService.parseJSONDocument(textDocument)
  if (jsonDocument.root === undefined) {
    return {
      type: 'json:object',
      range: Range.create(0, 0),
      properties: []
    }
  }
  return transformer(jsonDocument.root)
}
