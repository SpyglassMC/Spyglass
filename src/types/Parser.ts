import ParsingError from './ParsingError'

/**
 * Represent an argument parser.
 * @template T Type of the parsed data. Can be string, Selector, NBT, etc.
 */
export default interface Parser<T> {
    /**
     * Parse the input string.
     * @param input The input string.
     */
    parse(input: string): ParserResult<T>
}

/**
 * Represent a parsed result.
 * @template T Type of the parsed data. Can be a string, Selector, NBT, etc.
 */
export interface ParserResult<T> {
    /**
     * Parsed data.
     */
    data?: T
    /**
     * All errors occurred while the process of parsing.
     */
    errors?: ParsingError[]
}
