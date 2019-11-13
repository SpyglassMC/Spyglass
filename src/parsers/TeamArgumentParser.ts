import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, getCompletions, getSafeCategory } from '../types/ClientCache'
import { VanillaConfig } from '../types/Config'

export default class TeamArgumentParser extends ArgumentParser<string> {
    readonly identity = 'team'

    constructor(
        private readonly isDefinition = false
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, _manager = undefined, config = VanillaConfig, cache: ClientCache = {}): ArgumentParserResult<string> {
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
        //#region Errors & Cache
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected a team but got nothing',
                false
            ))
        } else {
            if (this.isDefinition) {
                ans.cache = {
                    teams: {
                        [value]: {
                            def: [{ start, end: start + value.length }],
                            ref: []
                        }
                    }
                }
            } else {
                if (Object.keys(category).includes(value)) {
                    ans.cache = {
                        teams: {
                            [value]: {
                                def: [],
                                ref: [{ start, end: start + value.length }]
                            }
                        }
                    }
                } else if (config.lint.strictTeamCheck) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + value.length },
                        `undefined team ‘${value}’`,
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
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
