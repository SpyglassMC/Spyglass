import { locale } from '../locales'
import { getDiagnosticSeverity } from '../types'
import { getCompletions, getSafeCategory } from '../types/ClientCache'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class TagArgumentParser extends ArgumentParser<string> {
    static identity = 'Tag'
    readonly identity = 'tag'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const category = getSafeCategory(ctx.cache, 'tag')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Completions
        if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
            ans.completions.push(...getCompletions(ctx.cache, 'tag', start, reader.cursor))
        }
        //#endregion
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.variable))
        //#endregion
        //#region Errors
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                locale('expected-got',
                    locale('tag'),
                    locale('nothing')
                ),
                false
            ))
        } else if (ctx.config.lint.strictTagCheck && ctx.config.lint.strictTagCheck![1] && !Object.keys(category).includes(value)) {
            ans.errors.push(new ParsingError(
                { start, end: start + value.length },
                locale('undefined-tag', locale('punc.quote', value)),
                undefined,
                getDiagnosticSeverity(ctx.config.lint.strictTagCheck![0])
            ))
        }
        //#endregion
        //#region Cache
        if (Object.keys(category).includes(value)) {
            ans.cache = {
                tag: {
                    [value]: {
                        def: [],
                        ref: [{ start, end: start + value.length }]
                    }
                }
            }
        }
        //#endregion
        return ans
    }

    getExamples(): string[] {
        return ['foo']
    }
}
