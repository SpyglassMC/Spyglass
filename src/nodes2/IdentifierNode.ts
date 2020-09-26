import { Node } from './Node'

/**
 * Represents an identifier (also known as namespaced ID/resource location) AST Node.
 */
export interface IdentifierNode extends Node {
    /**
     * The namespace of this identifier. 
     * 
     * `undefined` when the namespaced is omitted. 
     * 
     * It's _valid_ to set an empty string as namespace, e.g. `:foo` is a valid representation of `minecraft:foo`.
     */
    namespace?: string
}
