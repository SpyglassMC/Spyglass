import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ScoreboardSlotArgumentParser from './ScoreboardSlotArgumentParser'
import StringReader from '../utils/StringReader'
import Token, { TokenType } from '../types/Token'
import { arrayToCompletions, arrayToMessage } from '../utils/utils'
import { CompletionItemKind } from 'vscode-languageserver'
import ParsingError from '../types/ParsingError'
import { locale } from '../locales/Locales'

const RegularSep = '.'
const StatsSep = ':'

const StatsCategory: { [type: string]: string } = {
    custom: 'minecraft:custom_stat',
    crafted: 'minecraft:item',
    used: 'minecraft:item',
    broken: 'minecraft:item',
    mined: 'minecraft:block',
    killed: 'minecraft:entity_type',
    killed_by: 'minecraft:entity_type',
    picked_up: 'minecraft:item',
    dropped: 'minecraft:item'
}

const Category: { [type: string]: null | string | string[] } = {
    air: null,
    armor: null,
    deathCount: null,
    dummy: null,
    food: null,
    health: null,
    level: null,
    playerKillCount: null,
    teamkill: ScoreboardSlotArgumentParser.Colors,
    killedByTeam: ScoreboardSlotArgumentParser.Colors,
    totalKillCount: null,
    trigger: null,
    xp: null,
    ...StatsCategory
}

export default class ObjectiveCriterionArgumentParser extends ArgumentParser<string> {
    static identity = 'ObjectiveCriterion'

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
        let category = reader.readUntilOrEnd(' ', RegularSep, StatsSep)
        const pool = ['', 'minecraft', ...Object.keys(Category)]
        //#region Completions.
        if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
            ans.completions.push(...arrayToCompletions(
                Object.keys(Category),
                c => typeof Category[c.label] === 'string' ?
                    { ...c, kind: CompletionItemKind.Field } : c
            ))
            ans.completions.push({ label: 'minecraft', kind: CompletionItemKind.Module })
        }
        //#endregion
        //#region Errors.
        if (!pool.includes(category)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    arrayToMessage(pool, true, 'or'),
                    locale('punc.quote', category)
                )
            ))
        }
        //#endregion

        if (category === 'minecraft' || category === '') {
            try {
                reader
                    .expect(RegularSep)
                    .skip()
                const start = reader.cursor
                const pool = Object.keys(StatsCategory)
                category = reader.readUntilOrEnd(' ', StatsSep)
                //#region Completions.
                if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
                    ans.completions.push(...arrayToCompletions(
                        pool,
                        c => ({ ...c, kind: CompletionItemKind.Field })
                    ))
                }
                //#endregion
                //#region Errors.
                if (!pool.includes(category)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('expected-got',
                            arrayToMessage(pool, true, 'or'),
                            locale('punc.quote', category)
                        )
                    ))
                }
                //#endregion
            } catch (p) {
                ans.errors.push(p)
            }
        }
        const subCriteria: string[] | string | null = Category[category]
        if (subCriteria) {
            try {
                reader
                    .expect(typeof subCriteria === 'string' ? StatsSep : RegularSep)
                    .skip()
                let subResult: ArgumentParserResult<unknown>
                if (subCriteria instanceof Array) {
                    subResult = ctx.parsers.get('Literal', subCriteria).parse(reader, ctx)
                } else {
                    const newReader = reader.clone()
                    newReader.string = newReader.string.replace(new RegExp(`\\${RegularSep}`, 'g'), StatsSep)
                    subResult = ctx.parsers.get('Identity', [subCriteria]).parse(newReader, ctx)
                    reader.cursor = newReader.cursor
                }
                subResult.tokens = []
                combineArgumentParserResult(ans, subResult)
            } catch (p) {
                ans.errors.push(p)
            }
        }

        ans.data = reader.string.slice(start, reader.cursor)
        ans.tokens = [Token.from(start, reader, TokenType.type)]

        return ans
    }

    getExamples(): string[] {
        return ['dummy', 'minecraft.used:minecraft.carrot_on_a_stick']
    }
}
