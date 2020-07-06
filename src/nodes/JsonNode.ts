import { ClientCache, ParsingError, Token } from '../types'
import { JsonDocument } from './JsonDocument'

/**
 * Represent an root node in a JSON file.
 */
export interface JsonNode {
    json: JsonDocument,
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
    errors: ParsingError[]
}
