import { arrayToMessage, arrayToCompletions, quoteString } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import LiteralArgumentParser from './LiteralArgumentParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'

export default class QuotableLiteralArgumentParser extends LiteralArgumentParser {
    constructor(
        protected readonly literals: string[],
        private readonly shouldQuote: boolean,
        private readonly additionalLiterals = false,
        private readonly diagnosticSeverity = DiagnosticSeverity.Error
    ) { super() }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Get completions.
        if (ctx.cursor === reader.cursor) {
            ans.completions.push(
                ...arrayToCompletions(
                    this.literals.map(v => quoteString(v, ctx.config.lint.quoteType, this.shouldQuote))
                )
            )
        }
        if (StringReader.isQuote(reader.peek()) && ctx.cursor === reader.cursor + 1) {
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
                    locale('expected-got',
                        arrayToMessage(this.literals, true, 'or'),
                        locale('nothing')
                    ),
                    false
                )]
            } else if (!this.additionalLiterals && !this.literals.includes(value)) {
                ans.errors = [new ParsingError(
                    { start: start, end: start + value.length },
                    locale('expected-got',
                        arrayToMessage(this.literals, true, 'or'),
                        locale('meta.quote', value)
                    ),
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
