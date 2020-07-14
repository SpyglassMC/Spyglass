import { CompletionItem } from 'vscode-languageserver'
import { toFormattedString } from '../utils'
import { ClientCache, combineCache } from './ClientCache'
import { LintConfig } from './Config'
import { ParsingError } from './ParsingError'
import { Token } from './Token'
import { NodeRange } from '../nodes'
import { TextRange } from './TextRange'
import { ParserSuggestion } from './ParserSuggestion'

/**
 * Represent a parsed line in a function.
 */
export interface LineNode {
    [NodeRange]: TextRange,
    /**
     * All parsed argument nodes of the line.
     */
    args: LineArgumentNode<any>[],
    /**
     * Hints.
     */
    hint: {
        /**
         * Hints for previous nodes.
         */
        fix: string[],
        /**
         * Hints for the current node and the next node.
         */
        options: [string, string[]][]
    },
    /**
     * Semantic tokens of the line.
     */
    tokens: Token[],
    /**
     * All cache of the line.
     */
    cache?: ClientCache,
    /**
     * All errors occured while parsing the line.
     */
    errors?: ParsingError[],
    /**
     * All completions in this line.
     */
    completions?: ParserSuggestion[]
}

export type SaturatedLineNode = Required<LineNode>

export interface LineArgumentNode<T> {
    data: T,
    parser: string
}

export function combineLine(base: LineNode, override: LineNode): LineNode {
    // Args.
    if (override.args.length !== 0) {
        base.args = [...base.args, ...override.args]
    }
    // Tokens.
    if (override.tokens.length !== 0) {
        base.tokens = [...base.tokens, ...override.tokens]
    }
    // Hint.
    if (override.hint.fix.length !== 0) {
        base.hint.fix = [...base.hint.fix, ...override.hint.fix]
    }
    if (override.hint.options.length !== 0) {
        base.hint.options = [...base.hint.options, ...override.hint.options]
    }
    // Cache.
    if (base.cache || override.cache) {
        combineCache(base.cache, override.cache)
    }
    // Completions.
    if ((base.completions && base.completions.length !== 0) || (override.completions && override.completions.length !== 0)) {
        /* istanbul ignore next */
        base.completions = [...base.completions ? base.completions : [], ...override.completions ? override.completions : []]
    } else {
        delete base.completions
    }
    // Errors.
    if ((base.errors && base.errors.length !== 0) || (override.errors && override.errors.length !== 0)) {
        /* istanbul ignore next */
        base.errors = [...base.errors || [], ...override.errors || []]
    } else {
        delete base.errors
    }
    return base
}

export function combineSaturatedLine(base: SaturatedLineNode, override: LineNode): SaturatedLineNode {
    /* istanbul ignore next */
    override.completions = override.completions || []
    /* istanbul ignore next */
    override.errors = override.errors || []
    // Args.
    base.args = [...base.args, ...override.args]
    // Hint.
    base.hint.fix = [...base.hint.fix, ...override.hint.fix]
    base.hint.options = [...base.hint.options, ...override.hint.options]
    // Cache.
    combineCache(base.cache, override.cache)
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...override.errors]
    // Tokens.
    base.tokens = [...base.tokens, ...override.tokens]
    return base
}

export function saturatedLineToLine(line: SaturatedLineNode) {
    if (Object.keys(line.cache).length === 0) {
        delete line.cache
    }
    if (line.errors.length === 0) {
        delete line.errors
    }
    if (line.completions.length === 0) {
        delete line.completions
    }
}

export function lineToLintedString(line: LineNode, lint: LintConfig) {
    return line.args.map(v => toFormattedString(v.data, lint)).join(' ')
}
