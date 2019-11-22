import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { InsertTextFormat, CompletionItemKind } from 'vscode-languageserver'
import { VanillaConfig } from '../types/Config'

export default class CodeSnippetArgumentParser extends ArgumentParser<string> {
    readonly identity = 'codeSnippet'

    // istanbul ignore next
    parse(reader: StringReader, cursor: number = -1, _manager = undefined, { snippets } = VanillaConfig): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Completions.
        const startCursor = reader.cursor
        reader.readUntilOrEnd(' ')
        const endCursor = reader.cursor
        if (startCursor <= cursor && cursor <= endCursor) {
            for (const label in snippets) {
                // istanbul ignore next
                if (snippets.hasOwnProperty(label)) {
                    const insertText = snippets[label]
                    ans.completions.push({
                        label,
                        insertText,
                        insertTextFormat: InsertTextFormat.Snippet,
                        kind: CompletionItemKind.Snippet,
                    })
                }
            }
        }
        //#endregion

        //#region Errors.
        ans.errors = [new ParsingError(
            { start: reader.cursor, end: reader.cursor + 1 },
            'code snippets are invalid for the game',
            false
        )]
        //#endregion

        return ans
    }

    getExamples(): string[] {
        return []
    }
}
