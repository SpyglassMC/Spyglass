import { SCHEMAS } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'
import { PathPatterns } from '../types/PathPatterns'

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
    ['advancement', PathPatterns.advancement],
    ['loot_table', PathPatterns.loot_table],
    ['predicate', PathPatterns.predicate],
    /* dimension */
    ['dimension', PathPatterns.dimension],
    ['dimension_type', PathPatterns.dimension_type],
    /* worldgen */
    ['biome', PathPatterns['worldgen/biome']],
    ['configured_carver', PathPatterns['worldgen/configured_carver']],
    ['configured_decorator', PathPatterns['worldgen/configured_decorator']],
    ['configured_feature', PathPatterns['worldgen/configured_feature']],
    ['configured_structure_feature', PathPatterns['worldgen/configured_structure_feature']],
    ['configured_surface_builder', PathPatterns['worldgen/configured_surface_builder']],
    ['processor_list', PathPatterns['worldgen/processor_list']],
    ['template_pool', PathPatterns['worldgen/template_pool']]
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
