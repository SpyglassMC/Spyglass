import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { GlobalCache, getCompletions, getSafeCategory, combineCache } from '../types/Cache'
import { VanillaConfig } from '../types/Config'

export default class TeamArgumentParser extends ArgumentParser<string> {
    readonly identity = 'team'

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Completions
        if (reader.cursor === cursor) {
            ans.completions.push(...getCompletions(cache, 'teams'))
        }
        //#endregion
        const category = getSafeCategory(cache, 'teams')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Errors
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected a team but got nothing',
                false
            ))
        } else if (config.lint.strictTeamCheck && !Object.keys(category).includes(value)) {
            ans.errors.push(new ParsingError(
                { start, end: start + value.length },
                `undefined team ‘${value}’`,
                undefined,
                DiagnosticSeverity.Warning
            ))
        }
        //#endregion
        //#region Cache
        if (Object.keys(category).includes(value)) {
            ans.cache = {
                teams: {
                    [value]: {
                        def: [],
                        ref: [{ range: { start, end: start + value.length } }]
                    }
                }
            }
        }
        //#endregion
        return ans
    }

    getExamples(): string[] {
        return ['foo']
    }
}
