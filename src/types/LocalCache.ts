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
        fakeNames?: Definition[],
        tags?: Definition[]
    }
}

/**
 * 
 */
export interface Definition {
    /**
     * Value of the definition.
     * e.g. `value` of `#define tag debug` is `debug`.
     */
    value?: string,
    /**
     * Documentation of the definition.
     * Documents should be written before the definition and starts with `##`.
     * e.g.
     * ```
     * ## Detects the use of shift.
     * scoreboard objectives add shift minecraft.custom:minecraft.sneak_time
     * ```
     */
    doc?: string
}
