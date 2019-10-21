import Parser, { ArgumentParserResult } from '../types/Parser'
import StringReader from '../utils/StringReader'
import Config from '../types/Config'
import { GlobalCache } from '../types/Cache'

/**
 * Base class of argument parsers.
 */
export default abstract class ArgumentParser<T> implements Parser<T> {
    /**
     * Identity of the parser.
     */
    abstract readonly identity: string

    /**
     * Parse.
     * @param reader Input reader.
     * @param cursor The index where the cursor is. Used to compute completions.
     * @param config A config of the language server.
     * @param cache A global cache of the current workspace.
     */
    abstract parse(reader: StringReader, cursor?: number, config?: Config, cache?: GlobalCache): ArgumentParserResult<T>

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
