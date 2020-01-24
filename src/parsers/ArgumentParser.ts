import Parser, { ArgumentParserResult } from '../types/Parser'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'

/**
 * Base class of argument parsers.
 */
export default abstract class ArgumentParser<T> implements Parser<T> {
    static identity: string
    /**
     * Human-readable identity of the parser. Will be shown in hints.
     */
    abstract readonly identity: string

    /**
     * Parse.
     * @param reader Input reader.
     * @param ctx A ParsingContext.
     */
    abstract parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<T>

    /**
     * Default implements to return something like `<id: string>`
     */
    toHint(name: string, optional: boolean): string {
        const prefix = optional ? '[' : '<'
        const suffix = optional ? ']' : '>'
        return `${prefix}${name}: ${this.identity}${suffix}`
    }

    /**
     * Get examples of this argument.
     * 
     * @example
     * return ['true', 'false']
     */
    abstract getExamples(): string[]
}
