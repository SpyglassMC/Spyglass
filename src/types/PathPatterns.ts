import { FileType } from './ClientCache'

export const PathPatterns: { [key in FileType]: string } = {
    advancement: 'data/*/advancements/**/*.json',
    function: 'data/*/functions/**/*.mcfunction',
    loot_table: 'data/*/loot_tables/**/*.json',
    predicate: 'data/*/predicates/**/*.json',
    recipe: 'data/*/recipes/**/*.json',
    'tag/block': 'data/*/tags/blocks/**/*.json',
    'tag/entity_type': 'data/*/tags/entity_types/**/*.json',
    'tag/fluid': 'data/*/tags/fluids/**/*.json',
    'tag/function': 'data/*/tags/functions/**/*.json',
    'tag/item': 'data/*/tags/items/**/*.json',
    dimension: 'data/minecraft/dimension/*/**/*.json',
    dimension_type: 'data/minecraft/dimension_type/*/**/*.json',
    'worldgen/biome': 'data/minecraft/worldgen/biome/*/**/*.json',
    'worldgen/configured_carver': 'data/minecraft/worldgen/configured_carver/*/**/*.json',
    'worldgen/configured_decorator': 'data/minecraft/worldgen/configured_decorator/*/**/*.json',
    'worldgen/configured_feature': 'data/minecraft/worldgen/configured_feature/*/**/*.json',
    'worldgen/configured_structure_feature': 'data/minecraft/worldgen/configured_structure_feature/*/**/*.json',
    'worldgen/configured_surface_builder': 'data/minecraft/worldgen/configured_surface_builder/*/**/*.json',
    'worldgen/processor_list': 'data/minecraft/worldgen/processor_list/*/**/*.json',
    'worldgen/template_pool': 'data/minecraft/worldgen/template_pool/*/**/*.json'
}
