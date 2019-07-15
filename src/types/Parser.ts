import ParsingError from './ParsingError'

/**
 * Represent an argument parser.
 */
export default interface Parser {
    /**
     * Parse the input string.
     * @param input The input string.
     */
    parse(input: string): ParseResult
}

/**
 * Represent a parsed result.
 */
export interface ParseResult {
    /**
     * Parsed data. Can be a string, Selector, NBT, etc.
     */
    data?: any
    /**
     * All errors occurred while the process of parsing.
     */
    errors: ParsingError[]
}
