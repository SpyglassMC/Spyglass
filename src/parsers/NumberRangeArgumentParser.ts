import ArgumentParser from './ArgumentParser'
import Manager from '../types/Manager'
import NumberRange from '../types/NumberRange'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'

export default class NumberRangeArgumentParser extends ArgumentParser<NumberRange> {
    identity = 'numberRange'

    constructor(private readonly type: 'integer' | 'float') {
        super()
        this.identity = `${type}Range`
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>): ArgumentParserResult<NumberRange> {
        const ans: ArgumentParserResult<NumberRange> = {
            data: new NumberRange(this.type),
            completions: [],
            errors: [],
            cache: {}
        }
        const isDoublePeriods = () => reader.peek() === '.' && reader.peek(1) === '.'
        const start = reader.cursor

        if (cursor === start && this.type === 'integer') {
            ans.completions.push({ label: '-2147483648..2147483647' })
        }

        if (!reader.canRead()) {
            ans.errors.push(new ParsingError(
                { start: reader.cursor, end: reader.cursor + 1 },
                'expected a number range but got nothing',
                false
            ))
        } else {
            let min: number | undefined
            let max: number | undefined
            if (!isDoublePeriods()) {
                const result = manager.get('Number', [this.type]).parse(reader, cursor)
                min = result.data
                combineArgumentParserResult(ans, result)
            }
            if (isDoublePeriods()) {
                reader.skip(2)
                if (StringReader.canInNumber(reader.peek())) {
                    const result = manager.get('Number', [this.type]).parse(reader, cursor)
                    max = result.data
                    combineArgumentParserResult(ans, result)
                }
            } else {
                max = min
            }
            if (min && max && min > max) {
                ans.errors.push(
                    new ParsingError({ start, end: reader.cursor }, `the minimum value ${min} is larger than the maximum value ${max}`)
                )
            } else if (!min && !max) {
                ans.errors.push(
                    new ParsingError({ start, end: reader.cursor }, 'expected either a minimum value or a maximum value')
                )
            }
            ans.data = new NumberRange(this.type, min, max)
        }
        return ans
    }

    getExamples(): string[] {
        return ['0..5', '0', '-5', '-100..', '..100']
    }
}
