import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { GlobalCache, getCompletions, getSafeCategory, combineCache } from '../types/Cache'
import { VanillaConfig } from '../types/Config'

export default class ObjectiveArgumentParser extends ArgumentParser<string> {
    readonly identity = 'objective'

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, _manager = undefined, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<string> {
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
        //#region Errors
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected an objective but got nothing',
                false
            ))
        } else {
            if (config.lint.strictObjectiveCheck && !Object.keys(category).includes(value)) {
                ans.errors.push(new ParsingError(
                    { start, end: start + value.length },
                    `undefined objective ‘${value}’`,
                    undefined,
                    DiagnosticSeverity.Warning
                ))
            }
            if (value.length > 16) {
                ans.errors.push(new ParsingError(
                    { start, end: start + value.length },
                    `‘${value}’ exceeds the max length of objective name`
                ))
            }
        }
        //#endregion
        //#region Cache
        if (Object.keys(category).includes(value)) {
            ans.cache = {
                objectives: {
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
        return ['objective']
    }
}
