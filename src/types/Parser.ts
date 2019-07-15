import ParsingError from './ParsingError'

/**
 * Represent an argument parser.
 */
export default interface Parser {
    /**
     * Parse the input string.
     * @param input The input string.
     */
    parse(input: string): ParserResult
}

/**
 * Represent a parsed result.
 */
export interface ParserResult {
    /**
     * Parsed data. Can be a string, Selector, NBT, etc.
     */
    data?: any
    /**
     * All errors occurred while the process of parsing.
     */
    errors?: ParsingError[]
}
