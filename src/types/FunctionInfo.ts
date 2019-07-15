import Line from './Line'
import LocalCache from './LocalCache'

/**
 * Represent a parsed function.
 */
export default interface FunctionInfo {
    /**
     * All parsed lines in the function.
     */
    lines: Line[]
    /**
     * All cache of the function.
     * May be duplicated with the cache in `lines`. Just in order to accelerate refactoring.
     */
    cache?: LocalCache
    /**
     * Documentation of the function.
     * Support MarkDown syntax.
     * Support annotations like `@as`, `@params` and `@return`.
     */
    doc?: string
}
