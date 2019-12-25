import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, arrayToCompletions, quoteString } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import Config, { VanillaConfig } from '../types/Config'
import LiteralArgumentParser from './LiteralArgumentParser'
import { DiagnosticSeverity } from 'vscode-languageserver'

export default class QuotableLiteralArgumentParser extends LiteralArgumentParser {
    constructor(
        protected readonly literals: string[],
        private readonly shouldQuote: boolean,
        private readonly additionalLiterals = false,
        private readonly diagnosticSeverity = DiagnosticSeverity.Error
    ) { super() }

    parse(reader: StringReader, cursor: number = -1, _manager = undefined, config: Config = VanillaConfig): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Get completions.
        if (cursor === reader.cursor) {
            ans.completions.push(
                ...arrayToCompletions(
                    this.literals.map(v => quoteString(v, config.lint.quoteType, this.shouldQuote))
                )
            )
        }
        if (StringReader.isQuote(reader.peek()) && cursor === reader.cursor + 1) {
            ans.completions.push(
                ...arrayToCompletions(this.literals)
            )
        }
        //#endregion
        //#region Data
        try {
            const start = reader.cursor
            const value = reader.readString()
            ans.data = value
            //#region Get errors.
            if (value.length === 0) {
                ans.errors = [new ParsingError(
                    { start: start, end: start + 1 },
                    `expected ${arrayToMessage(this.literals, true, 'or')} but got nothing`,
                    false
                )]
            } else if (!this.additionalLiterals && !this.literals.includes(value)) {
                ans.errors = [new ParsingError(
                    { start: start, end: start + value.length },
                    `expected ${arrayToMessage(this.literals, true, 'or')} but got ‘${value}’`,
                    false,
                    this.diagnosticSeverity
                )]
            }
            //#endregion
        } catch (p) {
            ans.errors.push(p)
        }
        //#endregion

        return ans
    }
}
