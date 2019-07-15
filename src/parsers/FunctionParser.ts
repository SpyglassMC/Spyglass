import Parser from '../types/Parser'
import Function from '../types/Function'
import ParsingError from '../types/ParsingError'
import LineParser from './LineParser'

/**
 * Parse input string as a function.
 */
export default class FunctionParser implements Parser {
    parse(input: string) {
        const ans: {
            data: Function,
            errors: ParsingError[]
        } = {
            data: {
                lines: []
            },
            errors: []
        }

        const lines = input.split('\n')
        for (const line of lines) {
            const result = new LineParser().parse(line)

        }

        return ans
    }
}
