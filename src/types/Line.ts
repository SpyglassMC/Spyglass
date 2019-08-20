import LocalCache, { combineLocalCache } from './LocalCache'
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
    args: ArgumentNode<any>[]
    /**
     * Path of the command tree.
     */
    path: string[]
    /**
     * All cache of the line.
     */
    cache?: LocalCache
    /**
     * All errors occured while parsing the line.
     */
    errors?: ParsingError[]
    /**
     * All completions in this line.
     */
    completions?: CompletionItem[]
}

/**
 * `Line` without optional properties.
 */
export interface SaturatedLine extends Line {
    cache: LocalCache,
    errors: ParsingError[],
    completions: CompletionItem[]
}

export function combineLine(base: Line, override: Line): Line {
    // Args.
    if (override.args.length !== 0) {
        base.args = [...base.args, ...override.args]
    }
    // Path.
    if (override.path.length !== 0) {
        base.path = [...base.path, ...override.path]
    }
    // Cache.
    if (base.cache || override.cache) {
        base.cache = combineLocalCache(base.cache, override.cache)
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
        base.errors = [...base.errors ? base.errors : [], ...override.errors ? override.errors : []]
    } else {
        delete base.errors
    }
    return base
}

export function combineSaturatedLine(base: SaturatedLine, override: Line): SaturatedLine {
    /* istanbul ignore next */
    override.completions = override.completions ? override.completions : []
    /* istanbul ignore next */
    override.errors = override.errors ? override.errors : []
    // Args.
    base.args = [...base.args, ...override.args]
    // Path.
    base.path = [...base.path, ...override.path]
    // Cache.
    base.cache = combineLocalCache(base.cache, override.cache)
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...override.errors]
    return base
}

export function saturatedLineToLine(line: SaturatedLine) {
    if (Object.keys(line.cache.def).length === 0 && Object.keys(line.cache.ref).length === 0) {
        delete line.cache
    }
    if (line.errors.length === 0) {
        delete line.errors
    }
    if (line.completions.length === 0) {
        delete line.completions
    }
}
