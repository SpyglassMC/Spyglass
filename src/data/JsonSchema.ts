import { SCHEMAS } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'

export type JsonSchemaType =
    | 'advancement'
    | 'loot_table'
    | 'predicate'
    /* dimension */
    | 'dimension'
    | 'dimension_type'
    /* worldgen */
    | 'biome'
    | 'configured_carver'
    | 'configured_decorator'
    | 'configured_feature'
    | 'configured_structure_feature'
    | 'configured_surface_builder'
    | 'processor_list'
    | 'template_pool'

const globPatterns = new Map<JsonSchemaType, string>([
    ['advancement', 'data/*/advancements/**/*.json'],
    ['loot_table', 'data/*/loot_tables/**/*.json'],
    ['predicate', 'data/*/predicates/**/*.json'],
    /* dimension */
    ['dimension', 'data/minecraft/dimension/*/**/*.json'],
    ['dimension_type', 'data/minecraft/dimension_type/*/**/*.json'],
    /* worldgen */
    ['biome', 'data/minecraft/worldgen/biome/*/**/*.json'],
    ['configured_carver', 'data/minecraft/worldgen/configured_carver/*/**/*.json'],
    ['configured_decorator', 'data/minecraft/worldgen/configured_decorator/*/**/*.json'],
    ['configured_feature', 'data/minecraft/worldgen/configured_feature/*/**/*.json'],
    ['configured_structure_feature', 'data/minecraft/worldgen/configured_structure_feature/*/**/*.json'],
    ['configured_surface_builder', 'data/minecraft/worldgen/configured_surface_builder/*/**/*.json'],
    ['processor_list', 'data/minecraft/worldgen/processor_list/*/**/*.json'],
    ['template_pool', 'data/minecraft/worldgen/template_pool/*/**/*.json']
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
    // FIXME: JSON when the registry is moved under different versions.
    // Note: The stupid Webpack can't load the entry point of a scoped package correctly.
    await import(`@mcschema/java-${version}/lib/index.js`)
    return SCHEMAS
}
