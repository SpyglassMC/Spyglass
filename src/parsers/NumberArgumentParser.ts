import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import { locale } from '../locales/Locales'
import Token from '../types/Token'

export default class NumberArgumentParser extends ArgumentParser<number> {
    static identity = 'Number'
    identity = 'number'

    constructor(
        private readonly type: 'integer' | 'float' | 'double',
        private readonly min?: number,
        private readonly max?: number
    ) {
        super()
        this.identity = type
    }

    parse(reader: StringReader): ArgumentParserResult<number> {
        const ans: ArgumentParserResult<number> = {
            data: NaN,
            tokens: [],
            completions: [],
            errors: [],
            cache: {}
        }
        const start = reader.cursor
        try {
            ans.data = this.type === 'integer' ? reader.readInt() : reader.readFloat()
        } catch (p) {
            ans.errors.push(p)
        }
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, 'number'))
        //#endregion
        if (this.min !== undefined && !(ans.data >= this.min)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    locale('number.>=', this.min),
                    ans.data
                )
            ))
        }
        if (this.max !== undefined && !(ans.data <= this.max)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    locale('number.<=', this.max),
                    ans.data
                )
            ))
        }
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
