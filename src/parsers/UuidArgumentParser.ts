import { v4 as uuidV4 } from 'uuid'
import { CompletionItemKind } from 'vscode-languageserver'
import { locale } from '../locales'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class UuidArgumentParser extends ArgumentParser<string> {
    static identity = 'Uuid'
    readonly identity = 'uuid'

    static readonly Pattern = /^[0-9a-f]{1,8}-[0-9a-f]{1,4}-[0-9a-f]{1,4}-[0-9a-f]{1,4}-[0-9a-f]{1,12}$/i

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const start = reader.cursor
        const ans: ArgumentParserResult<string> = {
            data: reader.readUntilOrEnd(' '),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        //#region Errors.
        if (!UuidArgumentParser.Pattern.test(ans.data)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    locale('uuid'),
                    locale('punc.quote', ans.data)
                )
            ))
        }
        //#endregion

        //#region Completions.
        if (ctx.cursor === start) {
            const randomUuid = uuidV4()
            ans.completions.push({
                label: locale('completion.uuid.random'),
                insertText: randomUuid,
                detail: randomUuid,
                kind: CompletionItemKind.Snippet
            })
        }
        //#endregion

        ans.tokens.push(Token.from(start, reader, TokenType.number))

        return ans
    }
}
