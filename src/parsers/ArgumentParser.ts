import Parser, { ArgumentParserResult } from '../types/Parser'

/**
 * Base class of argument parsers.
 */
export default abstract class ArgumentParser<T> implements Parser<T> {
    abstract parse(input: string, startIndex?: number): ArgumentParserResult<T>

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
