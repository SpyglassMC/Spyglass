/**
 * A summary data for a certain namespace in the datapack.
 */
export default interface NamespaceSummary {
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
