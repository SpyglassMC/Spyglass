import { INode } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'

export type JsonSchemaType = 'advancement' | 'predicate' | 'dimension' | 'dimension-type' | 'loot-table'

const globPatterns = new Map<JsonSchemaType, string>([
    ['advancement', 'data/*/advancements/**.json'],
    ['loot-table', 'data/*/loot_tables/**.json'],
    ['predicate', 'data/*/predicate/**.json'],
    ['dimension', 'data/minecraft/dimension/*/*.json'],
    ['dimension-type', 'data/minecraft/dimension_type/*/*.json']
])


export function getJsonSchemaType(rel: string): JsonSchemaType | null {
    // minimatch(rel, str)
    // TODO: JSON-related
    throw new Error('Unimplemented')
}

/* istanbul ignore next */
export async function getJsonSchema(version: JsonSchemaVersion, type: JsonSchemaType) {
    const { schemas } = await import(`@mcschema/java-${version}`) as { schemas: { [type in JsonSchemaType]: INode } }
    return schemas[type]
}
