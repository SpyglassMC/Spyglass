import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType, getCategoryKey, CacheCategory } from '../types/ClientCache'
import { locale } from '../locales/Locales'
import Token, { TokenModifier, TokenType } from '../types/Token'

export default class DefinitionIDArgumentParser extends ArgumentParser<string> {
    static identity = 'DefinitionID'
    readonly identity = 'string'

    constructor(private readonly type: string) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const id = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = {
            data: id,
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        let token = TokenType.comment
        if (id) {
            if (isDefinitionType(this.type)) {
                ans.cache[getCategoryKey(this.type)] = {}
                const category = ans.cache[getCategoryKey(this.type)] as CacheCategory
                category[id] = {
                    def: [{ start, end: start + id.length }],
                    ref: []
                }
                //#region Tokens
                switch (this.type) {
                    case 'bossbar':
                    case 'storage':
                        token = TokenType.namespacedID
                        break
                    case 'entity':
                        token = TokenType.entity
                        break
                    default:
                        token = TokenType.variable
                        break
                }
                //#endregion
            }
        } else {
            ans.errors = [
                new ParsingError({ start, end: start + 1 }, locale('expected-got',
                    locale('string'),
                    locale('nothing')
                ))
            ]
        }
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, token, [TokenModifier.declaration]))
        //#endregion

        return ans
    }

    getExamples(): string[] {
        return ['$foo']
    }
}
