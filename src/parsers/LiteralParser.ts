import ArgumentParser from './ArgumentParser'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver';
import ParsingError from '../types/ParsingError';
import { arrayToMessage } from '../utils/utils';

export default class LiteralParser implements ArgumentParser<string> {
    private readonly literals: string[]

    constructor(literals: string[]) {
        if (literals.length === 0) {
            throw "Expected 'literals.length' to be more than 0."
        }
        this.literals = literals.sort()
    }

    parse(input: string, startIndex: number): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = {
            data: input
        }
        //#region Get completions.
        if (input === '') {
            ans.completions = this.literals.map(v => ({ label: v, kind: CompletionItemKind.Text }))
        }
        //#endregion
        //#region Get errors.
        let isFullMatch = false
        let isPartialMatch = false
        for (const literal of this.literals) {
            if (literal === input) {
                isFullMatch = true
            } else if (literal.toLowerCase().startsWith(input.toLowerCase())) {
                isPartialMatch = true
            }
        }
        if (!isFullMatch) {
            if (isPartialMatch) {
                ans.errors = [new ParsingError(
                    { start: startIndex, end: startIndex + input.length },
                    `expected one of ${arrayToMessage(this.literals)} but got '${input}'`
                )]
            } else {
                ans.errors = [new ParsingError(
                    { start: startIndex, end: startIndex + input.length },
                    `expected one of ${arrayToMessage(this.literals)} but got '${input}'`,
                    false
                )]
            }
        }
        //#endregion

        return ans
    }

    toString(): string {
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
