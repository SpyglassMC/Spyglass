import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'
import TextComponent from '../types/TextComponent'
import { ArgumentParserResult } from '../types/Parser'
import schema from 'datapack-json/src/shared/text_component.json'
import { getLanguageService, JSONSchema, TextDocument } from 'vscode-json-languageservice'
import { SynchronousPromise } from 'synchronous-promise'
import ParsingError from '../types/ParsingError'
import { remapCompletionItem } from '../utils/utils'

export default class TextComponentArgumentParser extends ArgumentParser<TextComponent> {
    static identity = 'TextComponent'
    readonly identity = 'textComponent'

    /* istanbul ignore next */
    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<TextComponent> {
        const ans: ArgumentParserResult<TextComponent> = {
            data: new TextComponent([]),
            tokens: [], errors: [], cache: {}, completions: []
        }

        const service = getLanguageService({
            contributions: [],
            promiseConstructor: SynchronousPromise
        })
        service.configure({
            validate: true, allowComments: false,
            schemas: [{ uri: schema['$id'], fileMatch: ['*.json'], schema: schema as unknown as JSONSchema }]
        })

        const text = ' '.repeat(reader.cursor) + reader.readRemaining()
        const document = TextDocument.create('dhp://text_component.json', 'json', 0, text)
        const jsonDocument = service.parseJSONDocument(document)

        service.doValidation(document, jsonDocument, undefined).then(diagnostics => {
            for (const diag of diagnostics) {
                ans.errors.push(new ParsingError(
                    { start: diag.range.start.character, end: diag.range.end.character },
                    diag.message.endsWith('.') ? diag.message.slice(0, -1) : diag.message,
                    undefined,
                    diag.severity
                ))
            }
        })

        service.doComplete(document, { line: 0, character: ctx.cursor }, jsonDocument).then(completions => {
            if (completions) {
                ans.completions.push(...completions.items.map(v => remapCompletionItem(v, ctx.lineNumber)))
            }
        })

        return ans
    }

    /* istanbul ignore next */
    getExamples(): string[] {
        return ['"hello world"', '""', '{"text":"hello world"}', '[""]']
    }
}
