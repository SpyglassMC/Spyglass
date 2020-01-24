import ArgumentParser from './ArgumentParser'
import NumberRange from '../types/NumberRange'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { locale } from '../locales/Locales'

export default class NumberRangeArgumentParser extends ArgumentParser<NumberRange> {
    static identity = 'NumberRange'
    identity = 'numberRange'

    constructor(
        private readonly type: 'integer' | 'float',
        private readonly isCycle = false
    ) {
        super()
        this.identity = `${type}Range`
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NumberRange> {
        const ans: ArgumentParserResult<NumberRange> = {
            data: new NumberRange(this.type),
            completions: [],
            errors: [],
            cache: {}
        }
        const isDoublePeriods = () => reader.peek() === '.' && reader.peek(1) === '.'
        const start = reader.cursor

        if (ctx.cursor === start && this.type === 'integer') {
            ans.completions.push({ label: '-2147483648..2147483647' })
        }

        if (!reader.canRead()) {
            ans.errors.push(new ParsingError(
                { start: reader.cursor, end: reader.cursor + 1 },
                locale('expected-got',
                    locale('number-range'),
                    locale('nothing')
                ),
                false
            ))
        } else {
            let min: number | undefined
            let max: number | undefined
            if (!isDoublePeriods()) {
                const result = ctx.parsers.get('Number', [this.type]).parse(reader, ctx)
                min = result.data
                combineArgumentParserResult(ans, result)
            }
            if (isDoublePeriods()) {
                reader.skip(2)
                if (StringReader.canInNumber(reader.peek())) {
                    const result = ctx.parsers.get('Number', [this.type]).parse(reader, ctx)
                    max = result.data
                    combineArgumentParserResult(ans, result)
                }
            } else {
                max = min
            }
            // Check values.
            if (!this.isCycle && min !== undefined && max !== undefined && min > max) {
                ans.errors.push(
                    new ParsingError({ start, end: reader.cursor }, locale('number-range.min>max', min, max))
                )
            } else if (min === undefined && max === undefined) {
                ans.errors.push(
                    new ParsingError({ start, end: reader.cursor }, locale('number-range.missing-min-and-max'))
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
