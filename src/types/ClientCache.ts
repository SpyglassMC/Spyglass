import TextRange, { remapTextRange } from './TextRange'
import { CompletionItem, MarkupKind } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import AdvancementInfo from './AdvancementInfo'
import TagInfo from './TagInfo'
import IndexMapping from './IndexMapping'

export const LatestCacheFileVersion = 6

export const DefaultCacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: LatestCacheFileVersion }

export interface CacheFile {
    cache: ClientCache,
    files: {
        [uri: string]: number | undefined
    },
    advancements: {
        [id: string]: AdvancementInfo | undefined
    },
    tags: {
        functions: {
            [id: string]: TagInfo | undefined
        }
    },
    version: number
}

/**
 * Represent a cache which is used to accelerate renaming and computing completions. 
 * 
 * For advancements, functions, lootTables, predicates, recipes and tags/*: Should rename files.  
 * For entities, storages and tags: Should use #define comments to define.  
 * For bossbars, objectives and teams: Should use respective `add` commands to define.  
 * For colors/*: Simply ignores.
 */
export interface ClientCache {
    advancements?: CacheCategory,
    functions?: CacheCategory,
    lootTables?: CacheCategory,
    predicates?: CacheCategory,
    recipes?: CacheCategory,
    'tags/blocks'?: CacheCategory,
    'tags/entityTypes'?: CacheCategory,
    'tags/fluids'?: CacheCategory,
    'tags/functions'?: CacheCategory,
    'tags/items'?: CacheCategory,
    bossbars?: CacheCategory,
    entities?: CacheCategory,
    objectives?: CacheCategory,
    storages?: CacheCategory,
    tags?: CacheCategory,
    teams?: CacheCategory,
    'colors'?: CacheCategory
}

export type CacheKey = keyof ClientCache

/**
 * A category in `ClientCache`.
 */
export type CacheCategory = {
    /**
     * The unit regarding this id.
     */
    [id: string]: CacheUnit | undefined
}

/**
 * An unit in `CacheCategory`.
 */
export type CacheUnit = {
    /**
     * The user-defined documentation for the unit.
     */
    doc?: string,
    /**
     * The definition element of this unit.
     * 
     * Duplicate definitions will override the first ones.
     * 
     * Empty for all categories except for `bossbars`, `entities`, `objectives`, `storages` and `tags`.
     */
    def: CachePosition[],
    /**
     * All reference elements of this unit.
     */
    ref: CachePosition[]
}

/**
 * An element in `CacheUnit`.
 */
export interface CachePosition extends TextRange {
    uri?: string,
    line?: number
}

export function getCacheFromChar(cache: ClientCache, char: number) {
    for (const type in cache) {
        const category = cache[type as CacheKey] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            for (const def of unit.def) {
                if (def.start <= char && char <= def.end) {
                    return { type: type as CacheKey, id, start: def.start, end: def.end }
                }
            }
            for (const ref of unit.ref) {
                if (ref.start <= char && char <= ref.end) {
                    return { type: type as CacheKey, id, start: ref.start, end: ref.end }
                }
            }
        }
    }
    return undefined
}

export function remapCachePosition(cache: ClientCache, mapping: IndexMapping) {
    for (const type in cache) {
        const category = cache[type as CacheKey] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            unit.def = unit.def.map(ele => remapTextRange(ele, mapping))
            unit.ref = unit.ref.map(ele => remapTextRange(ele, mapping))
        }
    }
}

export function removeCachePosition(cache: ClientCache, uri: Uri) {
    for (const type in cache) {
        const category = cache[type as CacheKey] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            unit.def = unit.def.filter(ele => ele.uri !== uri.toString())
            unit.ref = unit.ref.filter(ele => ele.uri !== uri.toString())
        }
    }
}

export function removeCacheUnit(cache: ClientCache, type: CacheKey, id: string) {
    const category = getSafeCategory(cache, type)
    delete category[id]
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineCache(base: ClientCache = {}, override: ClientCache = {}, addition?: { uri: Uri, line: number }) {
    const ans: ClientCache = base
    function initUnit(type: CacheKey, id: string) {
        ans[type] = getSafeCategory(ans, type)
        const ansCategory = ans[type] as CacheCategory
        ansCategory[id] = ansCategory[id] || { def: [], ref: [] }
        const ansUnit = ansCategory[id] as CacheUnit
        return ansUnit
    }
    function addPos(pos: CachePosition, poses: CachePosition[]) {
        if (addition) {
            pos.uri = addition.uri.toString()
            pos.line = addition.line
        }
        poses.push(pos)
    }
    for (const type in override) {
        const overrideCategory = override[type as CacheKey]
        for (const id in overrideCategory) {
            const overrideUnit = overrideCategory[id] as CacheUnit
            if (overrideUnit.def.length > 0 || overrideUnit.ref.length > 0 || overrideUnit.doc) {
                const ansUnit = initUnit(type as CacheKey, id)
                for (const overridePos of overrideUnit.def) {
                    addPos(overridePos, ansUnit.def)
                }
                for (const overridePos of overrideUnit.ref) {
                    addPos(overridePos, ansUnit.ref)
                }
                if (overrideUnit.doc) {
                    ansUnit.doc = overrideUnit.doc
                }
            }
        }
    }
    return ans
}

export function trimCache(cache: ClientCache) {
    for (const type in cache) {
        const category = cache[type as CacheKey] as CacheCategory
        if (type === 'bossbars' ||
            type === 'entities' ||
            type === 'objectives' ||
            type === 'tags' ||
            type === 'teams' ||
            type === 'storages' ||
            type === 'colors'
        ) {
            for (const id in category) {
                const unit = category[id] as CacheUnit
                if (unit.def.length === 0 && unit.ref.length === 0) {
                    delete category[id]
                }
            }
        }
        if (Object.keys(category).length === 0) {
            delete cache[type as CacheKey]
        }
    }
}

export function getSafeCategory(cache: ClientCache | undefined, type: CacheKey) {
    cache = cache || {}
    return cache[type] || {}
}

export function getCompletions(cache: ClientCache, type: CacheKey) {
    const category = getSafeCategory(cache, type)
    const ans: CompletionItem[] = []
    for (const id in category) {
        const unit = category[id] as CacheUnit
        const documentation = unit.doc || undefined
        ans.push({
            ...{ label: id },
            ...(documentation ? { documentation: { kind: MarkupKind.Markdown, value: documentation } } : {})
        })
    }
    return ans
}

type DefinitionType = 'bossbar' | 'entity' | 'objective' | 'tag' | 'team' | 'storage'

export function isDefinitionType(value: string): value is DefinitionType {
    return (
        value === 'bossbar' ||
        value === 'entity' ||
        value === 'objective' ||
        value === 'tag' ||
        value === 'team' ||
        value === 'storage'
    )
}

export function getCategoryKey(type: DefinitionType): CacheKey {
    if (type === 'bossbar') {
        return 'bossbars'
    } else if (type === 'entity') {
        return 'entities'
    } else if (type === 'objective') {
        return 'objectives'
    } else if (type === 'team') {
        return 'teams'
    } else if (type === 'storage') {
        return 'storages'
    } else {
        return 'tags'
    }
}

type TagType = 'tags/blocks' | 'tags/entityTypes' | 'tags/functions' | 'tags/fluids' | 'tags/items'

export function isTagType(type: CacheKey): type is TagType {
    return type.startsWith('tags/')
}

type FileType = 'advancements' | 'functions' | 'lootTables' | 'predicates' | 'recipes' | TagType

export function isFileType(type: string): type is FileType {
    return (
        type === 'advancements' ||
        type === 'functions' ||
        type === 'lootTables' ||
        type === 'predicates' ||
        type === 'recipes' ||
        isTagType(type as CacheKey)
    )
}

type NamespacedType = 'bossbars' | 'storages' | FileType

export function isNamespacedType(type: CacheKey): type is NamespacedType {
    return (
        type === 'bossbars' ||
        type === 'storages' ||
        isFileType(type as CacheKey)
    )
}
