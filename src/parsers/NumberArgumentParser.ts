import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'

export default class NumberArgumentParser extends ArgumentParser<number> {
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
        if (this.min !== undefined && ans.data < this.min) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                `expected a number larger than ${this.min} but got ${ans.data}`
            ))
        }
        if (this.max !== undefined && ans.data > this.max) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                `expected a number smaller than ${this.max} but got ${ans.data}`
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
