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
        functions?: string[],
        itemTags?: string[],
        objectives?: string[],
        entitys?: string[],
        tags?: string[]
    },
    /**
     * All defined definitions.
     */
    def: {
        entitys?: DescriptionsOfIDs,
        objectives?: DescriptionsOfIDs,
        tags?: DescriptionsOfIDs
    }
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineLocalCache(base: LocalCache = { def: {}, ref: {} }, override: LocalCache = { def: {}, ref: {} }) {
    const ans: LocalCache = { def: {}, ref: {} }
    // Combine definitions.
    for (const type in base.def) {
        /* istanbul ignore else */
        if (base.def.hasOwnProperty(type) && isDefinitionKey(type)) {
            const doi = base.def[type] as DescriptionsOfIDs
            ans.def[type] = { ...ans.def[type], ...doi }
        }
    }
    for (const type in override.def) {
        /* istanbul ignore else */
        if (override.def.hasOwnProperty(type) && isDefinitionKey(type)) {
            const doi = override.def[type] as DescriptionsOfIDs
            ans.def[type] = { ...ans.def[type], ...doi }
        }
    }
    // Combine references.
    for (const type in base.ref) {
        /* istanbul ignore else */
        if (base.ref.hasOwnProperty(type) && isReferenceKey(type)) {
            const references = base.ref[type] as string[]
            ans.ref[type] = [...references]
        }
    }
    for (const type in override.ref) {
        /* istanbul ignore else */
        if (override.ref.hasOwnProperty(type) && isReferenceKey(type)) {
            const references = override.ref[type] as string[]
            const origin = ans.ref[type]
            if (origin) {
                ans.ref[type] = [...origin, ...references]
            } else {
                ans.ref[type] = [...references]
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

export function isDefinitionType(value: any): value is 'entity' | 'objective' | 'tag' {
    return value === 'entity' || value === 'objective' || value === 'tag'
}

export function isDefinitionKey(value: any): value is 'entitys' | 'objectives' | 'tags' {
    return value === 'entitys' || value === 'objectives' || value === 'tags'
}

export function isReferenceKey(value: any): value is 'advancements' |
    'lootTables' | 'recipes' | 'blockTags' | 'fluidTags' | 'functionTags' |
    'entityTypeTags' | 'itemTags' | 'objectives' | 'entitys' | 'tags' | 'functions' {
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
        value === 'entitys' ||
        value === 'tags' ||
        value === 'functions'
    )
}
