/**
 * Represent a cache which is used to accelerate renaming. 
 */
export default interface LocalCache {
    /**
     * All referenced resources/definitions.
     */
    ref: {
        advancements?: string[],
        lootTables?: string[],
        recipes?: string[],
        blockTags?: string[],
        fluidTags?: string[],
        functionTags?: string[],
        entityTypeTags?: string[],
        itemTags?: string[],
        objectives?: string[],
        fakeNames?: string[],
        tags?: string[]
    },
    /**
     * All defined definitions.
     */
    def: {
        objectives?: Definition[],
        fakePlayers?: Definition[],
        tags?: Definition[]
    }
}

/**
 * 
 */
export interface Definition {
    /**
     * ID of the definition.
     * e.g. `id` of `#define tag debug` is `debug`.
     */
    id?: string,
    /**
     * Description of the definition.
     */
    description?: string
}
