import { locale } from '../locales'
import { IdentityNode } from '../nodes/IdentityNode'
import { isCacheType, isDeclarableType, isNamespacedType } from '../types/ClientCache'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenModifier, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class DeclarationIDArgumentParser extends ArgumentParser<string> {
    static identity = 'DeclarationID'
    readonly identity = 'string'

    constructor(private readonly type: string) {
        super()
    }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const id = reader.readUntilOrEnd(' ')
        let processsedID = id
        const ans = ArgumentParserResult.create(id)
        let token = TokenType.comment
        if (id) {
            if (isCacheType(this.type) && isDeclarableType(this.type)) {
                //#region Tokens
                if (isNamespacedType(this.type)) {
                    processsedID = IdentityNode.fromString(id).toString()
                    token = TokenType.identity
                } else if (this.type === 'entity' || this.type === 'score_holder') {
                    token = TokenType.entity
                } else {
                    token = TokenType.variable
                }
                //#endregion
                ans.cache[this.type] = {
                    [processsedID]: {
                        dcl: [{ start, end: start + id.length }]
                    }
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
