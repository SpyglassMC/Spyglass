import { INode } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'

export type JsonSchemaType = 'advancement' | 'predicate' | 'dimension' | 'dimension-type' | 'loot-table'

const globPatterns = new Map<JsonSchemaType, string>([
    ['advancement', 'data/*/advancements/**/*.json'],
    ['loot-table', 'data/*/loot_tables/**/*.json'],
    ['predicate', 'data/*/predicates/**/*.json'],
    ['dimension', 'data/minecraft/dimension/*/*.json'],
    ['dimension-type', 'data/minecraft/dimension_type/*/*.json']
])

export function getJsonSchemaType(rel: string): JsonSchemaType | null {
    for (const [type, glob] of globPatterns) {
        if (minimatch(rel, glob)) {
            return type
        }
    }
    return null
}

/* istanbul ignore next */
export async function getJsonSchema(version: JsonSchemaVersion, type: JsonSchemaType) {
    // Note: The stupid Webpack can't load the entry point of a scoped package correctly.
    const { schemas } = await import(`@mcschema/java-${version}/lib/index.js`) as { schemas: { [type in JsonSchemaType]: INode } }
    return schemas[type]
}
