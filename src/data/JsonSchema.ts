import { SCHEMAS } from '@mcschema/core'
import minimatch from 'minimatch'
import { JsonSchemaVersion } from '../types'
import { PathPatterns } from '../utils/PathPatterns'

export const FallbackJsonSchemaRegistry = SCHEMAS

export type JsonSchemaType =
    | 'advancement'
    | 'dimension'
    | 'dimension_type'
    | 'loot_table'
    | 'predicate'
    | 'recipe'
    /* tag */
    | 'block_tag'
    | 'entity_type_tag'
    | 'fluid_tag'
    | 'function_tag'
    | 'item_tag'
    /* worldgen */
    | 'biome'
    | 'configured_carver'
    | 'configured_decorator'
    | 'configured_feature'
    | 'configured_structure_feature'
    | 'configured_surface_builder'
    | 'processor_list'
    | 'template_pool'
    /* misc */
    | 'pack_mcmeta'
    | 'text_component'

const globPatterns = new Map<JsonSchemaType, string>([
    ['advancement', PathPatterns.advancement],
    ['loot_table', PathPatterns.loot_table],
    ['predicate', PathPatterns.predicate],
    ['recipe', PathPatterns.recipe],
    /* tag */
    ['block_tag', PathPatterns['tag/block']],
    ['entity_type_tag', PathPatterns['tag/entity_type']],
    ['fluid_tag', PathPatterns['tag/fluid']],
    ['function_tag', PathPatterns['tag/function']],
    ['item_tag', PathPatterns['tag/item']],
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
    ['template_pool', PathPatterns['worldgen/template_pool']],
    /* misc */
    ['pack_mcmeta', 'pack.mcmeta'],
    ['text_component', 'text_component.json']
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
