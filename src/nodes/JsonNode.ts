import { JsonSchemaType } from '../data/JsonSchema'
import { ValidateResult } from '../types'
import { JsonDocument } from './JsonDocument'

/**
 * Represents a root node in a JSON file.
 */
export interface JsonNode extends ValidateResult {
    json: JsonDocument,
    schemaType: JsonSchemaType
}
