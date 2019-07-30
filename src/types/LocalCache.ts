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
        tags?: string[],
        [type: string]: string[] | undefined
    },
    /**
     * All defined definitions.
     */
    def: {
        fakePlayers?: Definition,
        objectives?: Definition,
        tags?: Definition,
        [type: string]: Definition | undefined
    }
}

/**
 * Definition.
 */
export interface Definition {
    /**
     * Description of the definition.
     * @example
     * `#define tag debug` => { debug: undefined }
     * `#define tag debug hh` => { debug: 'hh' }
     */
    [id: string]: string | undefined
}

export function isDefinitionType(value: any): value is 'fakePlayer' | 'objective' | 'tag' {
    return value === 'fakePlayer' || value === 'objective' || value === 'tag'
}
