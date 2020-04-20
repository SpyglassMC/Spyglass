import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import TimeNode from '../types/nodes/TimeNode'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import NumberNode from '../types/nodes/NumberNode'
import { NodeRange } from '../types/nodes/ArgumentNode'

export default class TimeArgumentParser extends ArgumentParser<TimeNode> {
    static identity = 'Time'
    static readonly Units = ['d', 's', 't']

    readonly identity = 'time'

    constructor() {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<TimeNode> {
        const ans: ArgumentParserResult<TimeNode> = {
            data: new TimeNode(NaN, '', 't'),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const start = reader.cursor

        const numberResult: ArgumentParserResult<NumberNode> = ctx.parsers.get('Number', ['float', 0]).parse(reader, ctx)
        combineArgumentParserResult(ans, numberResult)
        ans.data.value = numberResult.data.valueOf()
        ans.data.raw = numberResult.data.toString()

        if (ctx.cursor === reader.cursor) {
            ans.completions.push(...arrayToCompletions(TimeArgumentParser.Units))
        }

        if (StringReader.canInUnquotedString(reader.peek())) {
            const start = reader.cursor
            const unit = reader.read()
            ans.tokens.push(Token.from(start, reader, TokenType.keyword))
            if (unit === 'd' || unit === 's' || unit === 't') {
                ans.data.unit = unit
            } else {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('expected-got',
                        locale('time-unit'),
                        locale('punc.quote', unit)
                    )
                ))
            }
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    getExamples(): string[] {
        return ['0d', '0s', '0t', '0']
    }
}
