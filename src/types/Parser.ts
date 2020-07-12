import { CompletionItem } from 'vscode-languageserver'
import { StringReader } from '../utils/StringReader'
import { ClientCache, combineCache } from './ClientCache'
import { downgradeParsingError, ParsingError } from './ParsingError'
import { Token } from './Token'
import { ParserSuggestion } from './ParserSuggestion'

/**
 * Represent an argument parser.
 * @template T Type of the parsed data. Can be string, Selector, NBT, etc.
 */
export interface Parser<T> {
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

export interface ValidateResult {
    /**
     * All errors occurred while the process of parsing.
     */
    errors: ParsingError[],
    /**
     * Local cache.
     */
    cache: ClientCache,
    /**
     * Semantic tokens.
     */
    tokens: Token[]
}

/**
 * ValidateResult with completions.
 */
export interface LegacyValidateResult extends ValidateResult {
    /**
     * Completions.
     */
    completions: ParserSuggestion[]
}

/**
 * Represent a result parsed by argument parser.
 * @template T Type of the parsed data. Can be a string, Selector, NBT, etc.
 */
export interface ArgumentParserResult<T> extends ParserResult<T>, LegacyValidateResult {}

export function combineArgumentParserResult(base: ArgumentParserResult<any>, override: ArgumentParserResult<any>): void {
    // Cache.
    combineCache(base.cache, override.cache)
    // Tokens.
    base.tokens = [...base.tokens, ...override.tokens]
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...downgradeParsingError(override.errors)]
}
