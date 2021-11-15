import { FileType } from '../types/ClientCache'

export const GeneralPathPattern = 'data/**/*.{json,mcfunction,nbt}'

export const PathPatterns: Record<FileType, string> = {
    advancement: 'data/*/advancements/**/*.json',
    dimension: 'data/*/dimension/**/*.json',
    dimension_type: 'data/*/dimension_type/**/*.json',
    function: 'data/*/functions/**/*.mcfunction',
    item_modifier: 'data/*/item_modifiers/**/*.json',
    loot_table: 'data/*/loot_tables/**/*.json',
    predicate: 'data/*/predicates/**/*.json',
    recipe: 'data/*/recipes/**/*.json',
    structure: 'data/*/structures/**/*.nbt',
    'tag/block': 'data/*/tags/blocks/**/*.json',
    'tag/entity_type': 'data/*/tags/entity_types/**/*.json',
    'tag/fluid': 'data/*/tags/fluids/**/*.json',
    'tag/function': 'data/*/tags/functions/**/*.json',
    'tag/game_event': 'data/*/tags/game_events/**/*.json',
    'tag/item': 'data/*/tags/items/**/*.json',
    'worldgen/biome': 'data/*/worldgen/biome/**/*.json',
    'worldgen/configured_carver': 'data/*/worldgen/configured_carver/**/*.json',
    'worldgen/configured_decorator': 'data/*/worldgen/configured_decorator/**/*.json',
    'worldgen/configured_feature': 'data/*/worldgen/configured_feature/**/*.json',
    'worldgen/configured_structure_feature': 'data/*/worldgen/configured_structure_feature/**/*.json',
    'worldgen/configured_surface_builder': 'data/*/worldgen/configured_surface_builder/**/*.json',
    'worldgen/noise': 'data/*/worldgen/noise/**/*.json',
    'worldgen/noise_settings': 'data/*/worldgen/noise_settings/**/*.json',
    'worldgen/placed_feature': 'data/*/worldgen/placed_feature/**/*.json',
    'worldgen/processor_list': 'data/*/worldgen/processor_list/**/*.json',
    'worldgen/template_pool': 'data/*/worldgen/template_pool/**/*.json'
}
