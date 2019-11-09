import { ClientCache, combineCache } from './ClientCache'
import ParsingError from './ParsingError'
import { CompletionItem } from 'vscode-languageserver'
import ArgumentNode from './ArgumentNode'

/**
 * Represent a parsed line in a function.
 */
export default interface Line {
    /**
     * All parsed arguments of the line.
     */
    args: ArgumentNode<any>[],
    /**
     * Hints.
     */
    hint: {
        /**
         * Hints for previous nodes. The last element in the array stands for the current node.
         */
        fix: string[],
        /**
         * Hints for the next node.
         */
        options: string[]
    },
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
    completions?: CompletionItem[]
}

/**
 * `Line` without optional properties.
 */
export interface SaturatedLine extends Line {
    cache: ClientCache,
    errors: ParsingError[],
    completions: CompletionItem[]
}

export function combineLine(base: Line, override: Line): Line {
    // Args.
    if (override.args.length !== 0) {
        base.args = [...base.args, ...override.args]
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
        base.cache = combineCache(base.cache, override.cache)
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

export function combineSaturatedLine(base: SaturatedLine, override: Line): SaturatedLine {
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
    base.cache = combineCache(base.cache, override.cache)
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...override.errors]
    return base
}

export function saturatedLineToLine(line: SaturatedLine) {
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
