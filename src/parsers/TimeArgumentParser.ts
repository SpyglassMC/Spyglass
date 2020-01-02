import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import Time from '../types/Time'

export default class TimeArgumentParser extends ArgumentParser<Time> {
    static readonly Units = ['d', 's', 't']

    readonly identity = 'time'

    constructor() {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Time> {
        const ans: ArgumentParserResult<Time> = {
            data: new Time(NaN, 't'),
            errors: [],
            cache: {},
            completions: []
        }

        const numberResult = ctx.parsers.get('Number', ['float', 0]).parse(reader, ctx)
        const number = numberResult.data as number
        combineArgumentParserResult(ans, numberResult)
        ans.data.value = number

        if (ctx.cursor === reader.cursor) {
            ans.completions.push(...arrayToCompletions(TimeArgumentParser.Units))
        }

        if (StringReader.canInUnquotedString(reader.peek())) {
            const unit = reader.read()
            if (unit === 'd' || unit === 's' || unit === 't') {
                ans.data.unit = unit
            } else {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor - 1, end: reader.cursor },
                    `expected a time unit but got ‘${unit}’`
                ))
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['0d', '0s', '0t', '0']
    }
}
