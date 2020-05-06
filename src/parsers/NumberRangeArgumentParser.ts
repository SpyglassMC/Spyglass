import { locale } from '../locales'
import { NodeRange } from '../types/nodes/ArgumentNode'
import { NumberNode } from '../types/nodes/NumberNode'
import { NumberRangeNode } from '../types/nodes/NumberRangeNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class NumberRangeArgumentParser extends ArgumentParser<NumberRangeNode> {
    static identity = 'NumberRange'
    identity = 'numberRange'

    constructor(
        private readonly type: 'integer' | 'float',
        private readonly isCycle = false
    ) {
        super()
        this.identity = `numberRange.${type}`
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NumberRangeNode> {
        const ans: ArgumentParserResult<NumberRangeNode> = {
            data: new NumberRangeNode(this.type),
            tokens: [],
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
            let min: NumberNode | undefined
            let max: NumberNode | undefined
            if (!isDoublePeriods()) {
                const result: ArgumentParserResult<NumberNode> = ctx.parsers.get('Number', [this.type]).parse(reader, ctx)
                min = result.data
                combineArgumentParserResult(ans, result)
            }
            if (isDoublePeriods()) {
                ans.tokens.push(new Token({ start: reader.cursor, end: reader.cursor + 2 }, TokenType.keyword))
                reader.skip(2)
                if (StringReader.canInNumber(reader.peek())) {
                    const result: ArgumentParserResult<NumberNode> = ctx.parsers.get('Number', [this.type]).parse(reader, ctx)
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
            ans.data = new NumberRangeNode(this.type, min, max)
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    getExamples(): string[] {
        return ['0..5', '0', '-5', '-100..', '..100']
    }
}
