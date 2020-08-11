import { StringReader } from '../utils/StringReader'
import { ClientCache, combineCache } from './ClientCache'
import { ParserSuggestion } from './ParserSuggestion'
import { downgradeParsingError, ParsingError } from './ParsingError'
import { Token } from './Token'

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

export namespace ParserResult {
    export function create<T>(data: T): ParserResult<T> {
        return { data }
    }
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
    tokens: Token[],
    /**
     * Signature hints.
     * @example
     * {
     *   fix: ['advancement'],
     *   options: [
     *     ['grant', ['<target: entity>']],
     *     ['revoke', ['<target: entity>']]
     *   ]
     * }
     * @example
     * {
     *   fix: ['setblock', '<pos: 3D vector>'],
     *   options: [
     *     ['<block: block>', ['[destroy|keep|replace]']]
     *   ]
     * }
     */
    hint: {
        /**
         * Hints for previous nodes.
         */
        fix: string[],
        /**
         * Hints for the current node and the following nodes.
         */
        options: [string, string[]][]
    }
}

export namespace ValidateResult {
    export function create(partial: Partial<ValidateResult> = {}): ValidateResult {
        return {
            cache: partial.cache ?? {},
            errors: partial.errors ?? [],
            hint: partial.hint ?? { fix: [], options: [] },
            tokens: partial.tokens ?? []
        }
    }
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

export namespace LegacyValidateResult {
    export function create(partial: Partial<LegacyValidateResult> = {}): LegacyValidateResult {
        return {
            completions: partial.completions ?? [],
            ...ValidateResult.create(partial)
        }
    }
}

/**
 * Represent a result parsed by argument parser.
 * @template T Type of the parsed data. Can be a string, Selector, NBT, etc.
 */
export interface ArgumentParserResult<T> extends ParserResult<T>, LegacyValidateResult { }

export namespace ArgumentParserResult {
    export function create<T>(data: T, partial: Partial<ArgumentParserResult<T>> = {}): ArgumentParserResult<T> {
        return {
            ...ParserResult.create(data),
            ...LegacyValidateResult.create(partial)
        }
    }
}

export function combineArgumentParserResult(base: ArgumentParserResult<any>, override: Partial<LegacyValidateResult>): void {
    // Cache.
    combineCache(base.cache, override.cache)
    // Tokens.
    base.tokens = [...base.tokens, ...override?.tokens ?? []]
    // Completions.
    base.completions = [...base.completions, ...override?.completions ?? []]
    // Errors.
    base.errors = [...base.errors, ...downgradeParsingError(override?.errors ?? [])]
}
