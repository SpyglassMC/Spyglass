import { locale } from '../locales'
import { NodeRange } from '../nodes/ArgumentNode'
import { NumberNode } from '../nodes/NumberNode'
import { TimeNode } from '../nodes/TimeNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { arrayToCompletions } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'
import { Parsers } from './Parsers'

export class TimeArgumentParser extends ArgumentParser<TimeNode> {
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

        const numberResult: ArgumentParserResult<NumberNode> = new Parsers.Number('float', 0).parse(reader, ctx)
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
