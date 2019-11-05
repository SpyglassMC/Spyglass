import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'

export default class LiteralArgumentParser extends ArgumentParser<string> {
    readonly identity = 'literal'

    private readonly literals: string[]
    private readonly extraChars: string[] = []

    constructor(...literals: string[]) {
        super()
        // if (literals.length === 0) {
        //     throw new Error('expected ‘literals.length’ to be more than 0')
        // }
        this.literals = literals
        for (const literal of literals) {
            if (!StringReader.canInUnquotedString(literal)) {
                for (const char of literal) {
                    if (!this.extraChars.includes(char) && !StringReader.canInUnquotedString(char)) {
                        this.extraChars.push(char)
                    }
                }
            }
        }
    }

    parse(reader: StringReader, cursor: number = -1): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        //#region Get completions.
        if (reader.cursor === cursor) {
            ans.completions = arrayToCompletions(this.literals)
        }
        //#endregion
        //#region Data
        const start = reader.cursor
        let remaningLiterals = this.literals
        let value = ''
        while (reader.canRead() && (StringReader.canInUnquotedString(reader.peek()) || this.extraChars.includes(reader.peek()))) {
            const nextValue = `${value}${reader.peek()}`
            const nextRemaningLiterals = remaningLiterals.filter(v => v.startsWith(nextValue))
            if (remaningLiterals.includes(value) && nextRemaningLiterals.length === 0) {
                break
            }
            reader.skip()
            value = nextValue
            remaningLiterals = nextRemaningLiterals
        }
        ans.data = value
        //#endregion
        //#region Get errors.
        let isFullMatch = false
        let isPartialMatch = false
        for (const literal of this.literals) {
            if (literal === value) {
                isFullMatch = true
            } else if (literal.toLowerCase().startsWith(value.toLowerCase())) {
                isPartialMatch = true
            }
        }
        if (!isFullMatch) {
            if (isPartialMatch) {
                if (value.length > 0) {
                    ans.errors = [new ParsingError(
                        { start: start, end: start + value.length },
                        `expected one of ${arrayToMessage(this.literals)} but got ‘${value}’`
                    )]
                } else {
                    ans.errors = [new ParsingError(
                        { start: start, end: start + 1 },
                        `expected one of ${arrayToMessage(this.literals)} but got nothing`,
                        false
                    )]
                }
            } else {
                ans.errors = [new ParsingError(
                    { start: start, end: start + value.length },
                    `expected one of ${arrayToMessage(this.literals)} but got ‘${value}’`,
                    false
                )]
            }
        }
        //#endregion

        return ans
    }

    toHint(): string {
        if (this.literals.length === 1) {
            return this.literals[0]
        } else {
            return `(${this.literals.join('|')})`
        }
    }

    getExamples(): string[] {
        return this.literals
    }
}
