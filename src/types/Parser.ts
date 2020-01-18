import { ClientCache, combineCache } from './ClientCache'
import { CompletionItem } from 'vscode-languageserver'
import ParsingError from './ParsingError'
import StringReader from '../utils/StringReader'

/**
 * Represent an argument parser.
 * @template T Type of the parsed data. Can be string, Selector, NBT, etc.
 */
export default interface Parser<T> {
    /**
     * Parse.
     * @param reader Input reader.
     */
    parse(reader: StringReader, ...params: any[]): ParserResult<T>
}

/**
 * Represent a parsed result.
 * @template T Type of the parsed data. Can be a FunctionInfo, Line, etc.
 */
export interface ParserResult<T> {
    /**
     * Parsed data.
     */
    data: T
}

/**
 * Represent a result parsed by argument parser.
 * @template T Type of the parsed data. Can be a string, Selector, NBT, etc.
 */
export interface ArgumentParserResult<T> extends ParserResult<T> {
    data: T,
    /**
     * All errors occurred while the process of parsing.
     */
    errors: ParsingError[],
    /**
     * Local cache.
     */
    cache: ClientCache,
    /**
     * Completions.
     */
    completions: CompletionItem[]
}

export function combineArgumentParserResult(base: ArgumentParserResult<any>, override: ArgumentParserResult<any>): void {
    // Cache.
    combineCache(base.cache, override.cache)
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...override.errors.map(v => new ParsingError(v.range, v.message, true, v.severity))]
}
