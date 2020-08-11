import { plugins } from '..'
import { JsonNode } from '../nodes/JsonNode'

interface BaseDocument<T, U> {
    type: T,
    nodes: U[]
}

export interface McfunctionDocument extends BaseDocument<'mcfunction', plugins.SyntaxComponent<any>> { }

export interface JsonDocument extends BaseDocument<'json', JsonNode> { }

export type DatapackDocument = McfunctionDocument | JsonDocument

export function isMcfunctionDocument(doc: DatapackDocument): doc is McfunctionDocument {
    return doc.type === 'mcfunction'
}

export function isJsonDocument(doc: DatapackDocument): doc is JsonDocument {
    return doc.type === 'json'
}
