import Parser, { ArgumentParserResult } from '../types/Parser'
import StringReader from '../utils/StringReader'

/**
 * Base class of argument parsers.
 */
export default abstract class ArgumentParser<T> implements Parser<T> {
    /**
     * Parse.
     * @param reader Input reader.
     * @param data All parsed data of nodes before this argument.
     */
    abstract parse(reader: StringReader, data?: any[]): ArgumentParserResult<T>

    /**
     * @example
     * return '(foo|bar)'
     */
    abstract toString(...args: any): string

    /**
     * Get examples of this argument.
     * 
     * @example
     * return ['true', 'false']
     */
    abstract getExamples(): string[]
}
