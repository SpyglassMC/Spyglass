import { CollectionRegistry, SchemaRegistry } from '@mcschema/core'
import { getCollections as getFallbackCollections, getSchemas as getFallbackSchemas } from '@mcschema/java-1.17'
import minimatch from 'minimatch'
import { JsonSchemaVersion, Registry } from '../types'
import { PathPatterns } from '../utils/PathPatterns'
import { FallbackRegistry } from './VanillaData'

export const FallbackJsonSchemaRegistry = getFallbackSchemas(setUpJsonCollections(getFallbackCollections(), FallbackRegistry))

export type JsonSchemaType =
    | 'advancement'
    | 'dimension'
    | 'dimension_type'
    | 'item_modifier'
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
    | 'noise_settings'
    | 'processor_list'
    | 'template_pool'
    /* misc */
    | 'pack_mcmeta'
    | 'text_component'

const globPatterns: Record<JsonSchemaType, string> = {
    advancement: PathPatterns.advancement,
    dimension: PathPatterns.dimension,
    dimension_type: PathPatterns.dimension_type,
    item_modifier: PathPatterns.item_modifier,
    loot_table: PathPatterns.loot_table,
    predicate: PathPatterns.predicate,
    recipe: PathPatterns.recipe,
    /* tag */
    block_tag: PathPatterns['tag/block'],
    entity_type_tag: PathPatterns['tag/entity_type'],
    fluid_tag: PathPatterns['tag/fluid'],
    function_tag: PathPatterns['tag/function'],
    item_tag: PathPatterns['tag/item'],
    /* worldgen */
    biome: PathPatterns['worldgen/biome'],
    configured_carver: PathPatterns['worldgen/configured_carver'],
    configured_decorator: PathPatterns['worldgen/configured_decorator'],
    configured_feature: PathPatterns['worldgen/configured_feature'],
    configured_structure_feature: PathPatterns['worldgen/configured_structure_feature'],
    configured_surface_builder: PathPatterns['worldgen/configured_surface_builder'],
    noise_settings: PathPatterns['worldgen/noise_settings'],
    processor_list: PathPatterns['worldgen/processor_list'],
    template_pool: PathPatterns['worldgen/template_pool'],
    /* misc */
    pack_mcmeta: 'pack.mcmeta',
    text_component: 'text_component.json'
}

export function getJsonSchemaType(rel: string): JsonSchemaType | null {
    for (const type of Object.keys(globPatterns) as JsonSchemaType[]) {
        const glob = globPatterns[type]
        if (minimatch(rel, glob)) {
            return type
        }
    }
    return null
}

function setUpJsonCollections(collections: CollectionRegistry, registry: Registry) {
    for (const key of Object.keys(registry)) {
        collections.register(key.replace(/^minecraft:/, ''), Object.keys(registry[key].entries))
    }
    return collections
}

/* istanbul ignore next */
export async function getJsonSchemas(version: JsonSchemaVersion, registry: Registry): Promise<SchemaRegistry> {
    const id = `java-${version}`
    // Note: The stupid Webpack can't load the entry point of a scoped package correctly.
    const { getSchemas, getCollections } = await import(`@mcschema/${id}/lib/index.js`)
    const collections = getCollections()
    const schemas = getSchemas(setUpJsonCollections(collections, registry))
    return schemas
}

export const FallbackJsonSchemas = getJsonSchemas('1.16', FallbackRegistry)
