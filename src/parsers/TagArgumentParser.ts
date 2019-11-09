import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, getCompletions, getSafeCategory } from '../types/ClientCache'
import { VanillaConfig } from '../types/Config'

export default class TagArgumentParser extends ArgumentParser<string> {
    readonly identity = 'tag'

    constructor() {
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
            ans.completions.push(...getCompletions(cache, 'tags'))
        }
        //#endregion
        const category = getSafeCategory(cache, 'tags')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Errors
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                'expected a tag but got nothing',
                false
            ))
        } else if (config.lint.strictTagCheck && !Object.keys(category).includes(value)) {
            ans.errors.push(new ParsingError(
                { start, end: start + value.length },
                `undefined tag ‘${value}’`,
                undefined,
                DiagnosticSeverity.Warning
            ))
        }
        //#endregion
        //#region Cache
        if (Object.keys(category).includes(value)) {
            ans.cache = {
                tags: {
                    [value]: {
                        def: [],
                        ref: [{ start, end: start + value.length }]
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
