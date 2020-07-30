import { MarkupKind, Position } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import { IndexMapping } from './IndexMapping'
import { ParserSuggestion } from './ParserSuggestion'
import { remapTextRange, TextRange } from './TextRange'

export const CacheVersion = 10

export const DefaultCacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: CacheVersion }

export interface CacheFile {
    cache: ClientCache,
    files: {
        [uri: string]: number | undefined
    },
    version: number
}

interface TagFileCache {
    'tag/block'?: CacheCategory,
    'tag/entity_type'?: CacheCategory,
    'tag/fluid'?: CacheCategory,
    'tag/function'?: CacheCategory,
    'tag/item'?: CacheCategory
}
interface WorldgenFileCache {
    'worldgen/biome'?: CacheCategory,
    'worldgen/configured_carver'?: CacheCategory,
    'worldgen/configured_decorator'?: CacheCategory,
    'worldgen/configured_feature'?: CacheCategory,
    'worldgen/configured_structure_feature'?: CacheCategory,
    'worldgen/configured_surface_builder'?: CacheCategory,
    'worldgen/processor_list'?: CacheCategory,
    'worldgen/template_pool'?: CacheCategory
}
interface FileCache extends TagFileCache, WorldgenFileCache {
    advancement?: CacheCategory,
    dimension?: CacheCategory,
    dimension_type?: CacheCategory,
    function?: CacheCategory,
    loot_table?: CacheCategory,
    predicate?: CacheCategory,
    recipe?: CacheCategory
}
interface AliasCache {
    'alias/entity'?: CacheCategory,
    'alias/uuid'?: CacheCategory,
    'alias/vector'?: CacheCategory
}
interface MiscCache extends AliasCache {
    bossbar?: CacheCategory,
    entity?: CacheCategory,
    objective?: CacheCategory,
    score_holder?: CacheCategory,
    storage?: CacheCategory,
    tag?: CacheCategory,
    team?: CacheCategory,
    color?: CacheCategory
}

/**
 * Represent a cache which is used to accelerate renaming and computing completions.
 */
export interface ClientCache extends FileCache, MiscCache { }
export type CacheType = keyof ClientCache
/**/ export type FileType = keyof FileCache
/*******/ export type TagRegularFileType = keyof TagFileCache
/*******/ export type WorldgenRegistryFileType = keyof WorldgenFileCache
/**/ export type MiscType = keyof MiscCache
/*******/ export type AliasType = keyof AliasCache

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
     * Empty for all categories except for `bossbar`, `entity`, `objective`, `storage` and `tag`.
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
    startLine?: number,
    startChar?: number,
    endLine?: number,
    endChar?: number
}

export function getCacheFromOffset(cache: ClientCache, offset: number) {
    for (const type in cache) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            for (const def of unit.def) {
                if (def.start <= offset && offset <= def.end) {
                    return { type: type as CacheType, id, start: def.start, end: def.end }
                }
            }
            for (const ref of unit.ref) {
                if (ref.start <= offset && offset <= ref.end) {
                    return { type: type as CacheType, id, start: ref.start, end: ref.end }
                }
            }
        }
    }
    return undefined
}

export function remapCachePosition(cache: ClientCache, mapping: IndexMapping) {
    for (const type in cache) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            unit.def = unit.def.map(ele => remapTextRange(ele, mapping))
            unit.ref = unit.ref.map(ele => remapTextRange(ele, mapping))
        }
    }
}

export function removeCachePosition(cache: ClientCache, uri: Uri) {
    for (const type in cache) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id in category) {
            const unit = category[id] as CacheUnit
            unit.def = unit.def.filter(ele => ele.uri && ele.uri !== uri.toString())
            unit.ref = unit.ref.filter(ele => ele.uri && ele.uri !== uri.toString())
        }
    }
}

export function removeCacheUnit(cache: ClientCache, type: CacheType, id: string) {
    const category = getSafeCategory(cache, type)
    delete category[id]
}

/**
 * Combine base cache with overriding cache.
 * @param base Base cache.
 * @param override Overriding cache.
 */
export function combineCache(base: ClientCache = {}, override: ClientCache = {}, addition?: { uri: Uri, getPosition: (offset: number) => Position }) {
    const ans: ClientCache = base
    function initUnit(type: CacheType, id: string) {
        ans[type] = getSafeCategory(ans, type)
        const ansCategory = ans[type] as CacheCategory
        ansCategory[id] = ansCategory[id] || { def: [], ref: [] }
        const ansUnit = ansCategory[id] as CacheUnit
        return ansUnit
    }
    function addPos(pos: CachePosition, arr: CachePosition[]) {
        if (addition) {
            pos.uri = addition.uri.toString()
            const startPos = addition.getPosition(pos.start)
            const endPos = addition.getPosition(pos.end)
            pos.startLine = startPos.line
            pos.startChar = startPos.character
            pos.endLine = endPos.line
            pos.endChar = endPos.character
        }
        arr.push(pos)
    }
    for (const type in override) {
        const overrideCategory = override[type as CacheType]
        for (const id in overrideCategory) {
            const overrideUnit = overrideCategory[id] as CacheUnit
            if (overrideUnit.def.length > 0 || overrideUnit.ref.length > 0 || overrideUnit.doc) {
                const ansUnit = initUnit(type as CacheType, id)
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

/* istanbul ignore next */
export function isAliasType(type: CacheType): type is AliasType {
    return type.startsWith('alias/')
}

/* istanbul ignore next */
export function canBeRenamed(type: CacheType) {
    return !isAliasType(type) && type !== 'color'
}

export function getFileTypeFromCategory(category: string) : FileType {
    if (category === 'dimension' || category === 'dimension_type') {
        return category
    } else {
        return category.slice(0, -1) as FileType
    }
}

export type DefinitionType = 'bossbar' | 'entity' | 'objective' | 'tag' | 'team' | 'score_holder' | 'storage'

export function isDefinitionType(value: string): value is DefinitionType {
    return (
        value === 'bossbar' ||
        value === 'entity' ||
        value === 'objective' ||
        value === 'tag' ||
        value === 'team' ||
        value === 'score_holder' ||
        value === 'storage'
    )
}

/* istanbul ignore next */
export function shouldHaveDef(type: CacheType) {
    return (
        isDefinitionType(type) ||
        isAliasType(type) ||
        type === 'color'
    )
}

export function isTagFileType(type: CacheType): type is TagRegularFileType {
    return type.startsWith('tag/')
}

export function isWorldgenRegistryFileType(type: CacheType): type is WorldgenRegistryFileType {
    return type.startsWith('worldgen/')
}

export function isFileType(type: string): type is FileType {
    return (
        type === 'advancement' ||
        type === 'dimension' ||
        type === 'dimension_type' ||
        type === 'function' ||
        type === 'loot_table' ||
        type === 'predicate' ||
        type === 'recipe' ||
        isTagFileType(type as CacheType) ||
        isWorldgenRegistryFileType(type as CacheType)
    )
}

export type NamespacedType = 'bossbar' | 'storage' | FileType

export function isNamespacedType(type: CacheType): type is NamespacedType {
    return (
        type === 'bossbar' ||
        type === 'storage' ||
        isFileType(type as CacheType)
    )
}

export function trimCache(cache: ClientCache) {
    for (const type in cache) {
        const category = cache[type as CacheType] as CacheCategory
        if (shouldHaveDef(type as CacheType)) {
            for (const id in category) {
                const unit = category[id] as CacheUnit
                if (unit.def.length === 0 && unit.ref.length === 0) {
                    delete category[id]
                }
            }
        }
        if (Object.keys(category).length === 0) {
            delete cache[type as CacheType]
        }
    }
}

/**
 * Pure function.
 */
export function getCacheForUri(cache: ClientCache, _uri: Uri) {
    const ans = JSON.parse(JSON.stringify(cache))
    for (const type in ans) {
        const category = ans[type as CacheType] as CacheCategory
        if (shouldHaveDef(type as CacheType)) {
            for (const id in category) {
                const unit = category[id] as CacheUnit
                // TODO (#319): check the access modifier here
                if (unit.def.length === 0) {
                    delete category[id]
                }
            }
        }
        if (Object.keys(category).length === 0) {
            delete ans[type as CacheType]
        }
    }
    return ans
}

export function getSafeCategory(cache: ClientCache | undefined, type: CacheType) {
    cache = cache || {}
    return cache[type] || {}
}

export function getCompletions(cache: ClientCache, type: CacheType, start: number, end: number) {
    const category = getSafeCategory(cache, type)
    const ans: ParserSuggestion[] = []
    for (const id in category) {
        const unit = category[id] as CacheUnit
        const documentation = unit.doc || undefined
        ans.push({
            ...{ label: id, start, end },
            ...(documentation ? { documentation: { kind: MarkupKind.Markdown, value: documentation } } : {})
        })
    }
    return ans
}
