import { locale } from '../locales'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { scoreboard } from '../types/scoreboard'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ScoreboardSlotArgumentParser extends ArgumentParser<string> {
    static identity = 'ScoreboardSlot'

    readonly identity = 'scoreboardSlot'

    constructor() {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans = ArgumentParserResult.create('')

        const start = reader.cursor
        const categoryResult = new ctx.parsers.Literal(...scoreboard.SlotCategory).parse(reader, ctx)
        const category = categoryResult.data as 'list' | 'sidebar' | 'belowName' | ''
        categoryResult.tokens = [Token.from(start, reader, TokenType.type)]
        combineArgumentParserResult(ans, categoryResult)

        if (category && reader.peek() === scoreboard.SlotSep) {
            if (category !== 'sidebar') {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('unexpected-scoreboard-sub-slot')
                ))
                ans.data = category
            } else {
                reader.skip()
                const start = reader.cursor
                const teamResult = new ctx.parsers.Literal(
                    ...scoreboard.SlotColors.map(v => `team${scoreboard.SlotSep}${v}`)
                ).parse(reader, ctx)
                const team = teamResult.data as string
                teamResult.tokens = [Token.from(start, reader, TokenType.type)]
                combineArgumentParserResult(ans, teamResult)
                ans.data = `${category}${scoreboard.SlotSep}${team}`
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
