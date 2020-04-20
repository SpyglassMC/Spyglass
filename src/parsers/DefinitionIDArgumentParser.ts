import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { isDefinitionType, getCategoryKey, CacheCategory } from '../types/ClientCache'
import { locale } from '../locales/Locales'
import Token, { TokenModifier, TokenType } from '../types/Token'
import IdentityNode from '../types/nodes/IdentityNode'

export default class DefinitionIDArgumentParser extends ArgumentParser<string> {
    static identity = 'DefinitionID'
    readonly identity = 'string'

    constructor(private readonly type: string) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        let id = reader.readUntilOrEnd(' ')
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
                //#region Tokens
                switch (this.type) {
                    case 'bossbar':
                    case 'storage':
                        token = TokenType.identity
                        id = IdentityNode.fromString(id).toString()
                        break
                    case 'entity':
                    case 'score_holder':
                        token = TokenType.entity
                        break
                    default:
                        token = TokenType.variable
                        break
                }
                //#endregion
                ans.cache[getCategoryKey(this.type)] = {}
                const category = ans.cache[getCategoryKey(this.type)] as CacheCategory
                category[id] = {
                    def: [{ start, end: start + id.length }],
                    ref: []
                }
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
        ans.tokens.push(Token.from(start, reader, token, new Set([TokenModifier.declaration])))
        //#endregion

        return ans
    }

    getExamples(): string[] {
        return ['$foo']
    }
}
