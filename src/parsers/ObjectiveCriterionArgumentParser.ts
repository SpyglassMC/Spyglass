import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import Manager from '../types/Manager'
import ParsingError from '../types/ParsingError'
import ScoreboardSlotArgumentParser from './ScoreboardSlotArgumentParser'
import StringReader from '../utils/StringReader'
import VanillaRegistries from '../types/VanillaRegistries'

export default class ObjectiveCriterionArgumentParser extends ArgumentParser<string> {
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

    constructor(private readonly registries = VanillaRegistries) {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }

        const categoryResult = manager.get('Literal', Object.keys(ObjectiveCriterionArgumentParser.Category)).parse(reader, cursor)
        const category = categoryResult.data as string
        let subCriteria = ObjectiveCriterionArgumentParser.Category[category]
        combineArgumentParserResult(ans, categoryResult)

        if (!subCriteria) {
            subCriteria = []
        } else if (typeof subCriteria === 'string') {
            subCriteria = Object.keys(this.registries[subCriteria].entries).map(v => v.slice(10))
        }

        if (subCriteria.length > 0) {
            try {
                reader
                    .expect(ObjectiveCriterionArgumentParser.Sep)
                    .skip()
                const subResult = manager.get('Literal', subCriteria).parse(reader, cursor)
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
