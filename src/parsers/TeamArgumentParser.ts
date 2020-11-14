import { DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { checkNamingConvention, getDiagnosticSeverity } from '../types'
import { getCompletions, getSafeCategory } from '../types/ClientCache'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { Token, TokenModifier, TokenType } from '../types/Token'
import { arrayToMessage } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class TeamArgumentParser extends ArgumentParser<string> {
    static identity = 'Team'
    readonly identity = 'team'

    constructor(
        private readonly isDefinition = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
        const ans = ArgumentParserResult.create('')
        const category = getSafeCategory(ctx.cache, 'team')
        //#region Data
        const start = reader.cursor
        const value = reader.readUnquotedString()
        ans.data = value
        //#endregion
        //#region Completions
        if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
            ans.completions.push(...getCompletions(ctx.cache, 'team', start, reader.cursor))
        }
        //#endregion
        //#region Tokens
        if (this.isDefinition) {
            ans.tokens.push(Token.from(start, reader, TokenType.variable, new Set([TokenModifier.declaration])))
        } else {
            ans.tokens.push(Token.from(start, reader, TokenType.variable))
        }
        //#endregion
        //#region Errors & Cache
        if (!value) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                locale('expected-got',
                    locale('team'),
                    locale('nothing')
                ),
                false
            ))
        } else {
            if (this.isDefinition) {
                ans.cache = {
                    team: {
                        [value]: {
                            def: [{ start, end: start + value.length }],
                            ref: []
                        }
                    }
                }
            } else {
                if (Object.keys(category).includes(value)) {
                    ans.cache = {
                        team: {
                            [value]: {
                                def: [],
                                ref: [{ start, end: start + value.length }]
                            }
                        }
                    }
                } else if (ctx.config.lint.strictTeamCheck) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + value.length },
                        locale('undefined-team', locale('punc.quote', value)),
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
            }
            if (ctx.config.lint.nameOfTeams && !checkNamingConvention(value, ctx.config.lint.nameOfTeams)) {
                const [severity, rule] = ctx.config.lint.nameOfTeams
                ans.errors.push(new ParsingError(
                    { start, end: start + value.length },
                    locale('team-not-following-convention',
                        locale('punc.quote', value),
                        arrayToMessage(rule)
                    ),
                    true,
                    getDiagnosticSeverity(severity)
                ))
            }
        }
        //#endregion
        return ans
    }

    getExamples(): string[] {
        return ['foo']
    }
}
