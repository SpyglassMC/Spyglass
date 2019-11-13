import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, getCompletions, getSafeCategory, CacheCategory, CachePosition, CacheUnit } from '../types/ClientCache'
import { VanillaConfig } from '../types/Config'

export default class ObjectiveArgumentParser extends ArgumentParser<string> {
    readonly identity = 'objective'

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
            ans.completions.push(...getCompletions(cache, 'objectives'))
        }
        //#endregion
        const category = getSafeCategory(cache, 'objectives')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Errors & Cache
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected an objective but got nothing',
                false
            ))
        } else {
            if (this.isDefinition) {
                ans.cache = {
                    objectives: {
                        [value]: {
                            def: [{ start, end: reader.cursor }],
                            ref: []
                        }
                    }
                }
            } else {
                if (Object.keys(category).includes(value)) {
                    ans.cache = {
                        objectives: {
                            [value]: {
                                def: [],
                                ref: [{ start, end: start + value.length }]
                            }
                        }
                    }
                } else if (config.lint.strictObjectiveCheck) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + value.length },
                        `undefined objective ‘${value}’`,
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
            }
            if (value.length > 16) {
                ans.errors.push(new ParsingError(
                    { start, end: start + value.length },
                    `‘${value}’ exceeds the max length of objective name`
                ))
            }
        }
        //#endregion
        return ans
    }

    getExamples(): string[] {
        return ['objective']
    }
}
