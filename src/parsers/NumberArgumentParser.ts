import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'

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
        try {
            ans.data = this.type === 'integer' ? reader.readInt() : reader.readFloat()
        } catch (p) {
            ans.errors.push(p)
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
