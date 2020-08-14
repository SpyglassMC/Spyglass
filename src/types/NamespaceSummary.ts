import rfdc from 'rfdc'

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
    const ans = rfdc()(partial)
    ans.advancement = (ans.advancement ?? []).concat(raw.advancements)
    ans.loot_table = (ans.loot_table ?? []).concat(raw.loot_tables)
    ans.recipe = (ans.loot_table ?? []).concat(raw.recipes)
    ans['tag/block'] = (ans['tag/block'] ?? []).concat(raw.tags.blocks)
    ans['tag/entity_type'] = (ans['tag/entity_type'] ?? []).concat(raw.tags.entity_types)
    ans['tag/fluid'] = (ans['tag/fluid'] ?? []).concat(raw.tags.fluids)
    ans['tag/item'] = (ans['tag/item'] ?? []).concat(raw.tags.items)
    return ans as NamespaceSummary
}
