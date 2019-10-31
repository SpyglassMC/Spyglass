import ArgumentParser from './ArgumentParser'
import Manager from '../types/Manager'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ParsingError from '../types/ParsingError'
import Time from '../types/Time'
import { arrayToCompletions } from '../utils/utils'

export default class TimeArgumentParser extends ArgumentParser<Time> {
    static readonly Units = ['d', 's', 't']

    readonly identity = 'time'

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>): ArgumentParserResult<Time> {
        const ans: ArgumentParserResult<Time> = {
            data: new Time(NaN, 't'),
            errors: [],
            cache: {},
            completions: []
        }

        const numberResult = manager.get('Number', ['float', 0]).parse(reader, cursor)
        const number = numberResult.data as number
        combineArgumentParserResult(ans, numberResult)
        ans.data.value = number

        if (cursor === reader.cursor) {
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
