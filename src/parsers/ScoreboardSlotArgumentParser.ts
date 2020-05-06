import { locale } from '../locales'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ScoreboardSlotArgumentParser extends ArgumentParser<string> {
    static identity = 'ScoreboardSlot'
    static readonly Category = ['belowName', 'list', 'sidebar']
    static readonly Colors = ['black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white']
    static readonly Sep = '.'

    readonly identity = 'scoreboardSlot'

    constructor() {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const start = reader.cursor
        const categoryResult = ctx.parsers.get('Literal', ScoreboardSlotArgumentParser.Category).parse(reader, ctx)
        const category = categoryResult.data as 'list' | 'sidebar' | 'belowName' | ''
        categoryResult.tokens = [Token.from(start, reader, TokenType.type)]
        combineArgumentParserResult(ans, categoryResult)

        if (category && reader.peek() === ScoreboardSlotArgumentParser.Sep) {
            if (category !== 'sidebar') {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('unexpected-scoreboard-sub-slot')
                ))
                ans.data = category
            } else {
                reader.skip()
                const start = reader.cursor
                const teamResult = ctx.parsers
                    .get('Literal', ScoreboardSlotArgumentParser.Colors.map(v => `team${ScoreboardSlotArgumentParser.Sep}${v}`))
                    .parse(reader, ctx)
                const team = teamResult.data as string
                teamResult.tokens = [Token.from(start, reader, TokenType.type)]
                combineArgumentParserResult(ans, teamResult)
                ans.data = `${category}${ScoreboardSlotArgumentParser.Sep}${team}`
            }
        } else {
            ans.data = category
        }

        return ans
    }

    getExamples(): string[] {
        return ['belowName', 'sidebar.team.red']
    }
}
