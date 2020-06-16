import schema from 'datapack-json/src/shared/text_component.json'
import { SynchronousPromise } from 'synchronous-promise'
import { getLanguageService, TextDocument } from 'vscode-json-languageservice'
import { NodeRange } from '../nodes/ArgumentNode'
import { TextComponentNode } from '../nodes/TextComponent'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { remapCompletionItem } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class TextComponentArgumentParser extends ArgumentParser<TextComponentNode> {
    static identity = 'TextComponent'
    readonly identity = 'textComponent'

    /* istanbul ignore next */
    static readonly Service = getLanguageService({
        contributions: [],
        promiseConstructor: SynchronousPromise
    })

    /* istanbul ignore next */
    static initialize() {
        TextComponentArgumentParser.Service.configure({
            validate: true, allowComments: false,
            schemas: [{ uri: schema['$id'], fileMatch: ['*.json'], schema: schema as any }]
        })
    }

    /* istanbul ignore next */
    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<TextComponentNode> {
        const start = reader.cursor
        const raw = reader.readRemaining()
        const end = reader.cursor
        const ans: ArgumentParserResult<TextComponentNode> = {
            data: new TextComponentNode(raw),
            tokens: [], errors: [], cache: {}, completions: []
        }

        const pos = ctx.document.positionAt(start)
        const text = ' '.repeat(pos.character) + raw
        const document = TextDocument.create('dhp://text_component.json', 'json', 0, text)
        const jsonDocument = TextComponentArgumentParser.Service.parseJSONDocument(document)

        //#region Data.
        ans.data.document = document
        ans.data.jsonDocument = jsonDocument
        ans.data[NodeRange] = { start, end }
        //#endregion

        //#region Errors.
        TextComponentArgumentParser.Service.doValidation(document, jsonDocument, undefined).then(diagnostics => {
            for (const diag of diagnostics) {
                ans.errors.push(new ParsingError(
                    { start: diag.range.start.character, end: diag.range.end.character },
                    diag.message.endsWith('.') ? diag.message.slice(0, -1) : diag.message,
                    undefined,
                    diag.severity
                ))
            }
        })
        //#endregion

        //#region Completions.
        TextComponentArgumentParser.Service.doComplete(document, { line: 0, character: ctx.cursor }, jsonDocument).then(completions => {
            if (completions) {
                ans.completions.push(...completions.items.map(v => remapCompletionItem(v, pos.line)))
            }
        })
        //#endregion

        return ans
    }

    /* istanbul ignore next */
    getExamples(): string[] {
        return ['"hello world"', '""', '{"text":"hello world"}', '[""]']
    }
}

/* istanbul ignore next */
export module TextComponentArgumentParser {
    TextComponentArgumentParser.initialize()
}
