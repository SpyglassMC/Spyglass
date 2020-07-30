import { ClientCache, ParsingError, Token } from '../types'
import { JsonDocument } from './JsonDocument'
import { JsonSchemaType } from '../data/JsonSchema'

/**
 * Represents a root node in a JSON file.
 */
export interface JsonNode {
    json: JsonDocument,
    schemaType: JsonSchemaType,
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
