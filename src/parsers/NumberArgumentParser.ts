import { locale } from '../locales'
import { NodeRange } from '../nodes/ArgumentNode'
import { NumberNode } from '../nodes/NumberNode'
import { ParsingContext } from '../types'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class NumberArgumentParser extends ArgumentParser<NumberNode> {
    static identity = 'Number'
    identity = 'number'

    constructor(
        private readonly type: 'integer' | 'float' | 'double',
        private readonly min?: number,
        private readonly max?: number
    ) {
        super()
        this.identity = `number.${type}`
    }

    parse(reader: StringReader, _ctx?: ParsingContext): ArgumentParserResult<NumberNode> {
        const ans: ArgumentParserResult<NumberNode> = {
            data: new NumberNode(NaN, ''),
            tokens: [],
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor
        try {
            const value = this.type === 'integer' ? reader.readInt() : reader.readFloat()
            ans.data.value = value
            ans.data.raw = reader.string.slice(start, reader.cursor)
        } catch (p) {
            ans.errors.push(p)
        }
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.number))
        //#endregion
        if (this.min !== undefined && !(ans.data.valueOf() >= this.min)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    locale('number.>=', this.min),
                    ans.data
                )
            ))
        }
        if (this.max !== undefined && !(ans.data.valueOf() <= this.max)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    locale('number.<=', this.max),
                    ans.data
                )
            ))
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    getExamples(): string[] {
        if (this.type === 'integer') {
            return ['0', '-123', '123']
        } else {
            return ['0', '1.2', '.5', '-1', '-.5', '-1234.56']
        }
    }
}
