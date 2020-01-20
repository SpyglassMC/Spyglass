import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { getCompletions, getSafeCategory } from '../types/ClientCache'
import { locale } from '../locales/Locales'

export default class ObjectiveArgumentParser extends ArgumentParser<string> {
    readonly identity = 'objective'

    constructor(
        private readonly isDefinition = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Completions
        if (reader.cursor === ctx.cursor) {
            ans.completions.push(...getCompletions(ctx.cache, 'objectives'))
        }
        //#endregion
        const category = getSafeCategory(ctx.cache, 'objectives')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Errors & Cache
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                locale('expected-got',
                    locale('objective'),
                    locale('nothing')
                ),
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
                } else if (ctx.config.lint.strictObjectiveCheck) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + value.length },
                        locale('undefined-objective', locale('meta.quote', value)),
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
            }
            if (value.length > 16) {
                ans.errors.push(new ParsingError(
                    { start, end: start + value.length },
                    locale('too-long', locale('meta.quote', value), locale('objective'), 16)
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
