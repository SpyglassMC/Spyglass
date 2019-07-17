import ParsingError from './ParsingError'
import LocalCache from './LocalCache'
import { CompletionItem } from 'vscode-languageserver'

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
 * @template T Type of the parsed data. Can be a FunctionInfo, Line, etc.
 */
export interface ParserResult<T> {
    /**
     * Parsed data.
     */
    data?: T
    /**
     * All errors occurred while the process of parsing.
     * Exist in the result of argument parsers.
     */
    errors?: ParsingError[]
    /**
     * Local cache. Exist in the result of argument parsers.
     */
    cache?: LocalCache
    /**
     * Completions. Exist in the result of argument parsers.
     */
    completions?: CompletionItem[]
}

/**
 * Represent a result parsed by argument parser.
 * @template T Type of the parsed data. Can be a string, Selector, NBT, etc.
 */
export interface ArgumentParserResult<T> extends ParserResult<T> {
    data?: T,
    errors: ParsingError[],
    cache: LocalCache,
    completions: []
}
