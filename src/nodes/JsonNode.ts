import { Diagnostic, JSONDocument } from 'vscode-json-languageservice'
import { ClientCache, Token } from '../types'

/**
 * Represent an root node in a JSON file.
 */
export interface JsonNode {
    json: JSONDocument,
    /**
     * Semantic tokens of the node.
     */
    tokens: Token[],
    /**
     * All cache of the node.
     */
    cache: ClientCache,
    /**
     * All errors of the node.
     */
    errors: Diagnostic[]
}
