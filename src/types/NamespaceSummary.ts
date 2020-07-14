import clone from 'clone'

/**
 * A summary data for a certain namespace in the datapack.
 */
export interface NamespaceSummary {
    advancement: string[],
    dimension: string[],
    dimension_type: string[],
    loot_table: string[],
    recipe: string[],
    'tag/block': string[],
    'tag/entity_type': string[],
    'tag/fluid': string[],
    'tag/item': string[],
    'worldgen/biome': string[],
    'worldgen/configured_carver': string[],
    'worldgen/configured_decorator': string[],
    'worldgen/configured_feature': string[],
    'worldgen/configured_structure_feature': string[],
    'worldgen/configured_surface_builder': string[],
    'worldgen/processor_list': string[],
    'worldgen/template_pool': string[]
}

export interface RawNamespaceSummary {
    advancements: string[],
    loot_tables: string[],
    recipes: string[],
    tags: {
        blocks: string[],
        entity_types: string[],
        fluids: string[],
        items: string[]
    }
}

export function compileNamespaceSummary(raw: RawNamespaceSummary, partial: Partial<NamespaceSummary>) {
    const ans = clone(partial)
    ans.advancement = raw.advancements
    ans.loot_table = raw.loot_tables
    ans.recipe = raw.recipes
    ans['tag/block'] = raw.tags.blocks
    ans['tag/entity_type'] = raw.tags.entity_types
    ans['tag/fluid'] = raw.tags.fluids
    ans['tag/item'] = raw.tags.items
    return ans as NamespaceSummary
}
