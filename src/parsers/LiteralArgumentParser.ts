import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import { TextEdit } from 'vscode-languageserver'

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
        const lengthToCursor = cursor - reader.cursor
        if (lengthToCursor >= 0) {
            const textToCursor = reader.remainingString.slice(0, lengthToCursor).toLowerCase()
            const candidates = this.literals.filter(v => v.toLowerCase().startsWith(textToCursor))
            ans.completions.push(...arrayToCompletions(candidates))
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
        if (!this.literals.includes(value)) {
            if (value.length > 0) {
                ans.errors = [new ParsingError(
                    { start: start, end: start + value.length },
                    `expected ${arrayToMessage(this.literals, true, 'or')} but got ‘${value}’`,
                    false
                )]
            } else {
                ans.errors = [new ParsingError(
                    { start: start, end: start + 1 },
                    `expected ${arrayToMessage(this.literals, true, 'or')} but got nothing`,
                    false
                )]
            }
        }
        //#endregion

        return ans
    }

    toHint(_: string, optional: boolean): string {
        let ans: string
        if (optional) {
            ans = `[${this.literals.join('|')}]`
        } else {
            if (this.literals.length === 1) {
                ans = this.literals[0]
            } else {
                ans = `(${this.literals.join('|')})`
            }
        }

        return ans
    }

    getExamples(): string[] {
        return this.literals
    }
}
