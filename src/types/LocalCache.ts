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
        fakePlayers?: DescriptionsOfIDs,
        objectives?: DescriptionsOfIDs,
        tags?: DescriptionsOfIDs
    }
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineLocalCache(base?: LocalCache, override?: LocalCache) {
    const ans: LocalCache = { def: {}, ref: {} }
    if (!base) {
        base = { def: {}, ref: {} }
    }
    if (!override) {
        override = { def: {}, ref: {} }
    }
    // Combine definitions.
    if (base.def) {
        for (const type in base.def) {
            if (base.def.hasOwnProperty(type) && isDefinitionKey(type)) {
                const doi = base.def[type]
                if (doi) {
                    ans.def[type] = { ...ans.def[type], ...doi }
                }
            }
        }
    }
    if (override.def) {
        for (const type in override.def) {
            if (override.def.hasOwnProperty(type) && isDefinitionKey(type)) {
                const doi = override.def[type]
                if (doi) {
                    ans.def[type] = { ...ans.def[type], ...doi }
                }
            }
        }
    }
    // Combine references.
    if (base.ref) {
        for (const type in base.ref) {
            if (base.ref.hasOwnProperty(type) && isReferenceKey(type)) {
                const references = base.ref[type]
                if (references) {
                    const origin = ans.ref[type]
                    if (origin) {
                        ans.ref[type] = [...origin, ...references]
                    } else {
                        ans.ref[type] = [...references]
                    }
                }
            }
        }
    }
    if (override.ref) {
        for (const type in override.ref) {
            if (override.ref.hasOwnProperty(type) && isReferenceKey(type)) {
                const references = override.ref[type]
                if (references) {
                    const origin = ans.ref[type]
                    if (origin) {
                        ans.ref[type] = [...origin, ...references]
                    } else {
                        ans.ref[type] = [...references]
                    }
                }
            }
        }
    }
    return ans
}

/**
 * Definition.
 */
export interface DescriptionsOfIDs {
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

export function isDefinitionKey(value: any): value is 'fakePlayers' | 'objectives' | 'tags' {
    return value === 'fakePlayers' || value === 'objectives' || value === 'tags'
}

export function isReferenceKey(value: any): value is 'advancements' | 'lootTables' | 'recipes' | 'blockTags' | 'fluidTags' | 'functionTags' | 'entityTypeTags' | 'itemTags' | 'objectives' | 'fakeNames' | 'tags' {
    return (
        value === 'advancements' ||
        value === 'lootTables' ||
        value === 'recipes' ||
        value === 'blockTags' ||
        value === 'fluidTags' ||
        value === 'functionTags' ||
        value === 'entityTypeTags' ||
        value === 'itemTags' ||
        value === 'objectives' ||
        value === 'fakeNames' ||
        value === 'tags'
    )
}
