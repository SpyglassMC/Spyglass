import { CollectionRegistry, SchemaRegistry } from '@mcschema/core'
import { getCollections as getFallbackCollections, getSchemas as getFallbackSchemas } from '@mcschema/java-1.17'
import minimatch from 'minimatch'
import { JsonSchemaVersion, Registry } from '../types'
import { PathPatterns } from '../utils/PathPatterns'
import { FallbackRegistry } from './VanillaData'

export const FallbackJsonSchemaRegistry = getFallbackSchemas(setUpJsonCollections(getFallbackCollections(), FallbackRegistry))

export type JsonSchemaType =
    | 'advancement'
    | 'damage_type'
    | 'dimension'
    | 'dimension_type'
    | 'item_modifier'
    | 'loot_table'
    | 'predicate'
    | 'recipe'
    /* tag */
    | 'block_tag'
    | 'damage_type_tag'
    | 'entity_type_tag'
    | 'fluid_tag'
    | 'function_tag'
    | 'game_event_tag'
    | 'item_tag'
    /* worldgen */
    | 'biome'
    | 'configured_carver'
    | 'configured_decorator'
    | 'configured_feature'
    | 'configured_structure_feature'
    | 'configured_surface_builder'
    | 'density_function'
    | 'flat_level_generator_preset'
    | 'noise_parameters'
    | 'noise_settings'
    | 'placed_feature'
    | 'processor_list'
    | 'structure'
    | 'structure_set'
    | 'template_pool'
    | 'world_preset'
    | 'biome_tag'
    | 'configured_carver_tag'
    | 'configured_decorator_tag'
    | 'configured_feature_tag'
    | 'configured_structure_feature_tag'
    | 'configured_surface_builder_tag'
    | 'density_function_tag'
    | 'noise_tag'
    | 'noise_settings_tag'
    | 'placed_feature_tag'
    | 'processor_list_tag'
    | 'structure_tag'
    | 'structure_set_tag'
    | 'template_pool_tag'
    /* misc */
    | 'pack_mcmeta'
    | 'text_component'
    | 'text_style'

const globPatterns: Record<JsonSchemaType, string> = {
    advancement: PathPatterns.advancement,
    damage_type: PathPatterns.damage_type,
    dimension: PathPatterns.dimension,
    dimension_type: PathPatterns.dimension_type,
    item_modifier: PathPatterns.item_modifier,
    loot_table: PathPatterns.loot_table,
    predicate: PathPatterns.predicate,
    recipe: PathPatterns.recipe,
    /* tag */
    block_tag: PathPatterns['tag/block'],
    damage_type_tag: PathPatterns['tag/damage_type'],
    entity_type_tag: PathPatterns['tag/entity_type'],
    fluid_tag: PathPatterns['tag/fluid'],
    function_tag: PathPatterns['tag/function'],
    game_event_tag: PathPatterns['tag/game_event'],
    item_tag: PathPatterns['tag/item'],
    /* worldgen */
    biome: PathPatterns['worldgen/biome'],
    configured_carver: PathPatterns['worldgen/configured_carver'],
    configured_decorator: PathPatterns['worldgen/configured_decorator'],
    configured_feature: PathPatterns['worldgen/configured_feature'],
    configured_structure_feature: PathPatterns['worldgen/configured_structure_feature'],
    configured_surface_builder: PathPatterns['worldgen/configured_surface_builder'],
    density_function: PathPatterns['worldgen/density_function'],
    flat_level_generator_preset: PathPatterns['worldgen/flat_level_generator_preset'],
    noise_parameters: PathPatterns['worldgen/noise'],
    noise_settings: PathPatterns['worldgen/noise_settings'],
    placed_feature: PathPatterns['worldgen/placed_feature'],
    processor_list: PathPatterns['worldgen/processor_list'],
    structure: PathPatterns['worldgen/structure'],
    structure_set: PathPatterns['worldgen/structure_set'],
    template_pool: PathPatterns['worldgen/template_pool'],
    world_preset: PathPatterns['worldgen/world_preset'],
    /* worldgen tag */
    biome_tag: PathPatterns['tag/worldgen/biome'],
    configured_carver_tag: PathPatterns['tag/worldgen/configured_carver'],
    configured_decorator_tag: PathPatterns['tag/worldgen/configured_decorator'],
    configured_feature_tag: PathPatterns['tag/worldgen/configured_feature'],
    configured_structure_feature_tag: PathPatterns['tag/worldgen/configured_structure_feature'],
    configured_surface_builder_tag: PathPatterns['tag/worldgen/configured_surface_builder'],
    density_function_tag: PathPatterns['tag/worldgen/density_function'],
    noise_tag: PathPatterns['tag/worldgen/noise'],
    noise_settings_tag: PathPatterns['tag/worldgen/noise_settings'],
    placed_feature_tag: PathPatterns['tag/worldgen/placed_feature'],
    processor_list_tag: PathPatterns['tag/worldgen/processor_list'],
    structure_tag: PathPatterns['tag/worldgen/structure'],
    structure_set_tag: PathPatterns['tag/worldgen/structure_set'],
    template_pool_tag: PathPatterns['tag/worldgen/template_pool'],
    /* misc */
    pack_mcmeta: 'pack.mcmeta',
    text_component: 'text_component.json',
    text_style: 'text_style.json'
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

export const FallbackJsonSchemas = getJsonSchemas('1.19.4', FallbackRegistry)
