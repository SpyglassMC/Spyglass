import TextRange from './TextRange'
import { CompletionItem } from 'vscode-languageserver'

export type GlobalCache = Cache<GlobalCacheElement>
export type LocalCache = Cache<LocalCacheElement>

/**
 * Represent a cache which is used to accelerate renaming and computing completions. 
 */
export interface Cache<T extends GlobalCacheElement | LocalCacheElement> {
    advancements?: CacheCategory<T>,
    functions?: CacheCategory<T>,
    'lootTables/fishing'?: CacheCategory<T>,
    'lootTables/entitiy'?: CacheCategory<T>,
    'lootTables/block'?: CacheCategory<T>,
    'lootTables/generic'?: CacheCategory<T>,
    predicates?: CacheCategory<T>,
    recipes?: CacheCategory<T>,
    'tags/blocks'?: CacheCategory<T>,
    'tags/entityTypes'?: CacheCategory<T>,
    'tags/fluids'?: CacheCategory<T>,
    'tags/functions'?: CacheCategory<T>,
    'tags/items'?: CacheCategory<T>,
    bossbars?: CacheCategory<T>,
    entities?: CacheCategory<T>,
    objectives?: CacheCategory<T>,
    tags?: CacheCategory<T>
}

/**
 * A category in `ClientCache`.
 */
export type CacheCategory<T extends GlobalCacheElement | LocalCacheElement> = {
    /**
     * The unit regarding this id.
     */
    [id: string]: Unit<T> | undefined
}

/**
 * An unit in `ClientCacheCategory`.
 */
type Unit<T extends GlobalCacheElement | LocalCacheElement> = {
    /**
     * The definition element of this unit.
     * 
     * Duplicate definition will override the first ones.
     * 
     * `null` for all categories except for `bossbars`, `entities`, `objectives` and `tags`.
     */
    def: (T & {
        /**
         * The documentation for this element.
         */
        documentation?: string
    })[],
    /**
     * All reference elements of this unit.
     */
    ref: T[]
}

/**
 * An element in `ClientCacheUnit` for cache file.
 */
export type GlobalCacheElement = {
    /**
     * The line location of this element.
     */
    line: {
        /**
         * The file URI.
         */
        uri: string,
        /**
         * The line number.
         */
        number: number
    }
}

/**
 * An element in `ClientCacheUnit` for `ArgumentParserResult`.
 */
export type LocalCacheElement = {
    range: TextRange
}

/**
 * Returns whether the value is a `GlobalElement` or not.
 * @param value A value.
 */
function isGlobalElement(value: any): value is GlobalCacheElement {
    return value.line && typeof value.line.uri === 'string' && typeof value.line.number === 'number'
}

/**
 * Returns whether the value is a `LocalElement` or not.
 * @param value A value.
 */
function isLocalElement(value: any): value is LocalCacheElement {
    return value.range && typeof value.range.start === 'number' && typeof value.range.end === 'number'
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineCache<T extends GlobalCacheElement | LocalCacheElement>
    (base: Cache<T> = {}, override: Cache<T> = {}) {
    function areElementsEqual(a: T, b: T) {
        // istanbul ignore else
        if (isGlobalElement(a) && isGlobalElement(b)) {
            return a.line.number === b.line.number && a.line.uri === b.line.uri
        } else if (isLocalElement(a) && isLocalElement(b)) {
            return a.range.start === b.range.start && a.range.end === b.range.end
        } else {
            throw 'Unreachable code'
        }
    }
    function removeElement(cache: Cache<T>, element: T) {
        for (const type in cache) {
            const category = cache[type as keyof Cache<T>] as CacheCategory<T>
            for (const id in category) {
                const unit = category[id] as Unit<T>
                for (const key in unit) {
                    const elements = unit[key as 'ref' | 'def']
                    unit[key as 'ref' | 'def'] =
                        elements.filter(ele => !areElementsEqual(ele, element)) as any
                }
            }
        }
    }
    function initUnit(type: string, id: string, overrideElement: T) {
        if (!ans[type as keyof Cache<T>]) {
            ans[type as keyof Cache<T>] = {}
        }
        const ansCategory = ans[type as keyof Cache<T>] as CacheCategory<T>
        if (!ansCategory[id]) {
            ansCategory[id] = { def: [], ref: [] }
        }
        const ansUnit = ansCategory[id] as Unit<T>
        removeElement(ans, overrideElement)
        return ansUnit
    }
    const ans: Cache<T> = JSON.parse(JSON.stringify(base))
    for (const type in override) {
        const overrideCategory = override[type as keyof Cache<T>]
        for (const id in overrideCategory) {
            const overrideUnit = overrideCategory[id] as Unit<T>
            for (const key in overrideUnit) {
                for (const overrideEle of overrideUnit[key as 'ref' | 'def']) {
                    const ansUnit = initUnit(type, id, overrideEle)
                    ansUnit[key as 'ref' | 'def'].push(overrideEle as any)
                }
            }
        }
    }
    return ans
}

export function trimCache<T extends LocalCacheElement | GlobalCacheElement>(cache: Cache<T>) {
    for (const type in cache) {
        const category = cache[type as keyof Cache<T>] as CacheCategory<T>
        for (const id in category) {
            const unit = category[id] as Unit<T>
            if (unit.def.length === 0 && unit.ref.length === 0) {
                delete category[id]
            }
        }
        if (Object.keys(category).length === 0) {
            delete cache[type as keyof Cache<T>]
        }
    }
}

export function getSafeCategory(cache: GlobalCache, type: keyof Cache<GlobalCacheElement>) {
    const category = cache[type]
    return category ? category : {}
}

export function getCompletions(cache: GlobalCache, type: keyof Cache<GlobalCacheElement>) {
    const category = cache[type]
    const ans: CompletionItem[] = []
    for (const id in category) {
        const unit = category[id] as Unit<GlobalCacheElement>
        console.log(unit)
        const def = unit.def[unit.def.length - 1]
        const documentation = def ? def.documentation : undefined
        ans.push({
            ...{ label: id },
            ...(documentation ? { documentation } : {})
        })
    }
    return ans
}

type DefinitionType = 'bossbar' | 'entity' | 'objective' | 'tag'

export function isDefinitionType(value: string): value is DefinitionType {
    return (
        value === 'bossbar' ||
        value === 'entity' ||
        value === 'objective' ||
        value === 'tag'
    )
}

export function getCategoryKey(type: DefinitionType): keyof Cache<any> {
    if (type === 'bossbar') {
        return 'bossbars'
    } else if (type === 'entity') {
        return 'entities'
    } else if (type === 'objective') {
        return 'objectives'
    } else {
        return 'tags'
    }
}
