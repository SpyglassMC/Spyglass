import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ScoreboardSlotArgumentParser from './ScoreboardSlotArgumentParser'
import StringReader from '../utils/StringReader'
import Token, { TokenType } from '../types/Token'

export default class ObjectiveCriterionArgumentParser extends ArgumentParser<string> {
    static identity = 'ObjectiveCriterion'
    static readonly Category: { [type: string]: null | string | string[] } = {
        air: null,
        armor: null,
        deathCount: null,
        dummy: null,
        food: null,
        health: null,
        level: null,
        'minecraft.custom:minecraft': 'minecraft:custom_stat',
        'minecraft.crafted:minecraft': 'minecraft:item',
        'minecraft.used:minecraft': 'minecraft:item',
        'minecraft.broken:minecraft': 'minecraft:item',
        'minecraft.mined:minecraft': 'minecraft:block',
        'minecraft.killed:minecraft': 'minecraft:entity_type',
        'minecraft.killed_by:minecraft': 'minecraft:entity_type',
        'minecraft.picked_up:minecraft': 'minecraft:item',
        'minecraft.dropped:minecraft': 'minecraft:item',
        playerKillCount: null,
        teamkill: ScoreboardSlotArgumentParser.Colors,
        killedByTeam: ScoreboardSlotArgumentParser.Colors,
        totalKillCount: null,
        trigger: null,
        xp: null
    }
    static readonly Sep = '.'

    readonly identity = 'objectiveCriterion'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const start = reader.cursor
        const categoryResult = ctx.parsers
            .get('Literal', Object.keys(ObjectiveCriterionArgumentParser.Category))
            .parse(reader, ctx)
        categoryResult.tokens = [Token.from(start, reader, 'type')]
        const category = categoryResult.data as string
        let subCriteria = ObjectiveCriterionArgumentParser.Category[category]
        combineArgumentParserResult(ans, categoryResult)

        if (!subCriteria) {
            subCriteria = []
        } else if (typeof subCriteria === 'string') {
            subCriteria = Object.keys(ctx.registries[subCriteria].entries).map(v => v.slice(10))
        }

        if (subCriteria.length > 0) {
            try {
                const start = reader.cursor
                reader
                    .expect(ObjectiveCriterionArgumentParser.Sep)
                    .skip()
                const subResult = ctx.parsers.get('Literal', subCriteria).parse(reader, ctx)
                subResult.tokens = [Token.from(start, reader, TokenType.type)]
                const sub: string = subResult.data
                combineArgumentParserResult(ans, subResult)
                ans.data = `${category}${ObjectiveCriterionArgumentParser.Sep}${sub}`
            } catch (p) {
                ans.errors.push(p)
            }
        }
        ans.data = ans.data || category

        return ans
    }

    getExamples(): string[] {
        return ['dummy', 'minecraft.used:minecraft.carrot_on_a_stick']
    }
}
