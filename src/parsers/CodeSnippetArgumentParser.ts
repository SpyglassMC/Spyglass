import { CompletionItemKind, InsertTextFormat } from 'vscode-languageserver'
import { locale } from '../locales'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class CodeSnippetArgumentParser extends ArgumentParser<string> {
    readonly identity = 'codeSnippet'

    /* istanbul ignore next */
    parse(reader: StringReader, { cursor: cursor, config: { snippets } }: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        //#region Completions.
        const startCursor = reader.offset
        ans.data = reader.readUntilOrEnd(' ')
        const endCursor = reader.offset
        if (startCursor <= cursor && cursor <= endCursor) {
            for (const label in snippets) {
                /* istanbul ignore next */
                if (snippets.hasOwnProperty(label)) {
                    const insertText = snippets[label]
                    ans.completions.push({
                        label,
                        insertText,
                        insertTextFormat: InsertTextFormat.Snippet,
                        kind: CompletionItemKind.Snippet
                    })
                }
            }
        }
        //#endregion

        //#region Errors.
        ans.errors = [new ParsingError(
            { start: reader.offset, end: reader.offset + 1 },
            locale('code-snippets-invalid-for-game'),
            false
        )]
        //#endregion

        return ans
    }

    getExamples(): string[] {
        return []
    }
}
