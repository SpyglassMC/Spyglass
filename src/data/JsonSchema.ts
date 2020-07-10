import { SCHEMAS } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'

export type JsonSchemaType = 'advancement' | 'dimension' | 'dimension_type' | 'loot_table' | 'predicate' | 'text_component'

const globPatterns = new Map<JsonSchemaType, string>([
    ['advancement', 'data/*/advancements/**/*.json'],
    ['dimension', 'data/minecraft/dimension/*/**/*.json'],
    ['dimension_type', 'data/minecraft/dimension_type/*/**/*.json'],
    ['loot_table', 'data/*/loot_tables/**/*.json'],
    ['predicate', 'data/*/predicates/**/*.json'],
    ['text_component', 'data/*/text_components/**/*.json']
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
export async function getJsonSchemas(version: JsonSchemaVersion) {
    // Note: The stupid Webpack can't load the entry point of a scoped package correctly.
    // FIXME: JSON when the registry is moved under different versions.
    await import(`@mcschema/java-${version}/lib/index.js`)
    return SCHEMAS
}
