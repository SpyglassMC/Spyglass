import TextRange from './TextRange'

/**
 * Represent a cache which is used to accelerate renaming and computing completions. 
 */
export default interface ClientCache {
    advancements?: {
        [namespacedID: string]: ClientCacheUnit & {
            criteria?: {
                [name: string]: ClientCacheUnit
            }
        }
    },
    functions?: ClientCacheCategory,
    lootTables?: {
        'minecraft:advancement_reward'?: ClientCacheCategory,
        'minecraft:block'?: ClientCacheCategory,
        'minecraft:chest'?: ClientCacheCategory,
        'minecraft:empty'?: ClientCacheCategory,
        'minecraft:entity'?: ClientCacheCategory,
        'minecraft:fishing'?: ClientCacheCategory,
        'minecraft:generic'?: ClientCacheCategory
    },
    predicates?: ClientCacheCategory,
    recipes?: ClientCacheCategory,
    blockTags?: ClientCacheCategory,
    entityTypeTags?: ClientCacheCategory,
    fluidTags?: ClientCacheCategory,
    functionTags?: ClientCacheCategory,
    itemTags?: ClientCacheCategory,
    bossbars?: ClientCacheCategory,
    entities?: ClientCacheCategory,
    objectives?: ClientCacheCategory,
    tags?: ClientCacheCategory
}

/**
 * A category in `ClientCache`.
 */
export interface ClientCacheCategory {
    /**
     * The unit regard this namespaced id.
     */
    [namespacedID: string]: ClientCacheUnit
}

/**
 * An unit in `ClientCacheCategory`.
 */
export interface ClientCacheUnit {
    /**
     * All definition elements of this unit.
     * 
     * Only the first element (`def[0]`) will be displayed, others will be used to generate error messages.
     * 
     * `null` for all categories except for `bossbars`, `entities`, `objectives` and `tags`.
     */
    def: null | ClientCacheElement[],
    /**
     * All reference elements of this unit.
     */
    ref: ClientCacheElement[]
}

/**
 * An element in `ClientCacheUnit`.
 */
export interface ClientCacheElement {
    /**
     * The line location regard this element.
     * 
     * Only exist for cache file.
     */
    line?: {
        /**
         * The file URI.
         */
        uri: string,
        /**
         * The line number.
         */
        number: number
    },
    /**
     * The text range of this element.
     * 
     * Only exist for ArgumentParserResult.
     */
    range?: TextRange,
    /**
     * The documentation for this element.
     * 
     * Only exist for definition elements.
     */
    documentation?: string
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineClientCache(base: ClientCache = {}, override: ClientCache = {}) {
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

export function isClientCacheType(value: any): value is keyof ClientCache {
    return (
        value === 'advancements' ||
        value === 'bossbars' ||
        value === 'entities' ||
        value === 'functions' ||
        value === 'lootTables' ||
        value === 'predicates' ||
        value === 'recipes' ||
        value === 'blockTags' ||
        value === 'entityTypeTags' ||
        value === 'fluidTags' ||
        value === 'functionTags' ||
        value === 'itemTags' ||
        value === 'objectives' ||
        value === 'tags'
    )
}
