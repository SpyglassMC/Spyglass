import { TextRange } from '../types'

/**
 * Represents an AST Node.
 */
export interface Node extends TextRange {
    /**
     * The type of the Node. It's recommended to use the same format as an namespaced ID for this field.
     * There can be Validator, Suggester, Colorizer, etc. corresponding to this type of Node.
     */
    type: string,
    parent?: Node
}
