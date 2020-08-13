import rfdc from 'rfdc'
import { MarkupKind, Position } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import { IdentityNode } from '../nodes'
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
/*******/ export type TagFileType = keyof TagFileCache
/*******/ export type WorldgenFileType = keyof WorldgenFileCache
/**/ export type MiscType = keyof MiscCache
/*******/ export type AliasType = keyof AliasCache

export const DeclarableCacheTypes: Readonly<CacheType[]> = Object.freeze([
    'advancement',
    'bossbar',
    'dimension',
    'dimension_type',
    'entity',
    'function',
    'loot_table',
    'objective',
    'predicate',
    'recipe',
    'score_holder',
    'storage',
    'tag',
    'tag/block',
    'tag/entity_type',
    'tag/fluid',
    'tag/function',
    'tag/item',
    'team',
    'worldgen/biome',
    'worldgen/configured_carver',
    'worldgen/configured_decorator',
    'worldgen/configured_feature',
    'worldgen/configured_structure_feature',
    'worldgen/configured_surface_builder',
    'worldgen/processor_list',
    'worldgen/template_pool'
])

/**
 * A category in `ClientCache`.
 */
export type CacheCategory = {
    /**
     * The unit regarding this id.
     */
    [id: string]: CacheUnit | undefined
}

export type CacheUnitPositionType = 'dcl' | 'def' | 'ref'
export const CacheUnitPositionTypes: CacheUnitPositionType[] = ['dcl', 'def', 'ref']

export function isCacheUnitPositionType(value: string): value is CacheUnitPositionType {
    return CacheUnitPositionTypes.includes(value as any)
}

/**
 * An unit in `CacheCategory`.
 */
export type CacheUnit = {
    /**
     * The user-defined documentation for the unit.
     */
    doc?: string
} & { [key in CacheUnitPositionType]?: CachePosition[] }

export type CacheVisibility = { pattern: string, type: 'advancement' | 'function' | 'tag/function' | '*' }

/**
 * An element in `CacheUnit`.
 */
export interface CachePosition extends TextRange {
    uri?: string,
    /**
     * An array of identities describing the visibility of this element.
     */
    visibility?: CacheVisibility[],
    /**
     * The scope of this position.
     */
    scope?: TextRange,
    startLine?: number,
    startChar?: number,
    endLine?: number,
    endChar?: number
}

export function getCacheFromOffset(cache: ClientCache, offset: number) {
    for (const type of Object.keys(cache)) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id of Object.keys(category)) {
            const unit = category[id] as CacheUnit
            for (const t of CacheUnitPositionTypes) {
                for (const ele of unit[t] ?? []) {
                    if (ele.start <= offset && offset <= ele.end) {
                        return { type: type as CacheType, id, start: ele.start, end: ele.end }
                    }
                }
            }
        }
    }
    return undefined
}

export function remapCachePosition(cache: ClientCache, mapping: IndexMapping) {
    for (const type of Object.keys(cache)) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id of Object.keys(category)) {
            const unit = category[id] as CacheUnit
            for (const t of CacheUnitPositionTypes) {
                if (unit[t]) {
                    unit[t] = unit[t]!.map(ele => remapTextRange(ele, mapping))
                }
            }
        }
    }
}

export function removeCachePosition(cache: ClientCache, uri: Uri) {
    for (const type of Object.keys(cache)) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id of Object.keys(category)) {
            const unit = category[id] as CacheUnit
            for (const t of CacheUnitPositionTypes) {
                if (unit[t]) {
                    unit[t] = unit[t]!.filter(ele => ele.uri !== uri.toString())
                }
            }
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
        ansCategory[id] = ansCategory[id] || {}
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
    for (const type of Object.keys(override)) {
        const overrideCategory = override[type as CacheType]
        for (const id of Object.keys(overrideCategory ?? {})) {
            const overrideUnit = overrideCategory![id] as CacheUnit
            if (overrideUnit.dcl?.length || overrideUnit.def?.length || overrideUnit.ref?.length || overrideUnit.doc) {
                const ansUnit = initUnit(type as CacheType, id)
                for (const type of CacheUnitPositionTypes) {
                    for (const overridePos of overrideUnit[type] ?? []) {
                        ansUnit[type] = ansUnit[type] ?? []
                        addPos(overridePos, ansUnit[type]!)
                    }
                }
                if (overrideUnit.doc) {
                    ansUnit.doc = overrideUnit.doc
                }
            }
        }
    }
    return ans
}

export function getFileTypeFromCategory(category: string): FileType {
    if (category === 'dimension' || category === 'dimension_type') {
        return category
    } else {
        return category.slice(0, -1) as FileType
    }
}

export function isInternalType(type: CacheType) {
    return isAliasType(type) || type === 'color'
}

export function isCacheType(value: string): value is CacheType {
    const type = value as CacheType
    return (
        isFileType(type) ||
        isMiscType(type)
    )
}

export function isTagFileType(type: CacheType): type is TagFileType {
    return type.startsWith('tag/')
}

export function isWorldgenRegistryFileType(type: CacheType): type is WorldgenFileType {
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

export function isAliasType(type: CacheType): type is AliasType {
    return type.startsWith('alias/')
}

export function isMiscType(type: CacheType): type is MiscType {
    return (
        type === 'bossbar' ||
        type === 'entity' ||
        type === 'objective' ||
        type === 'score_holder' ||
        type === 'storage' ||
        type === 'tag' ||
        type === 'team' ||
        type === 'color' ||
        isAliasType(type)
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
    for (const type of Object.keys(cache)) {
        const category = cache[type as CacheType] as CacheCategory
        for (const id of Object.keys(category)) {
            const unit = category[id] as CacheUnit
            if (!unit.dcl?.length && !unit.def?.length && !unit.ref?.length) {
                delete category[id]
            }
        }
        if (Object.keys(category).length === 0) {
            delete cache[type as CacheType]
        }
    }
}

export function testID(visibility: CacheVisibility | CacheVisibility[] = [], type: FileType, id: string): boolean {
    if (visibility instanceof Array) {
        if (visibility.length) {
            return visibility.some(v => testID(v, type, id))
        } else {
            // TODO (ACCESS): Allow changing default visibility.
            return testID({ type: '*', pattern: '**' }, type, id)
        }
    }
    if (visibility.type !== '*' && visibility.type !== type) {
        return false
    }
    const regex = new RegExp(`^${visibility.pattern
        .replace(/\*\*\//g, '.{0,}')
        .replace(/\*\*/g, '.{0,}')
        .replace(/\*/g, '[^/]{0,}')}$`)
    return regex.test(id)
}

/**
 * Pure function.
 */
export function getCacheForID(cache: ClientCache, targetType: FileType, targetID: IdentityNode) {
    const trimPositions = (unit: CacheUnit, t: 'dcl' | 'def') => {
        unit[t] = unit[t]
            // Filter by visibilities.
            ?.filter(p => testID(p.visibility, targetType, targetID.toString()))
            // // Remove positions with less details.
            // ?.filter(pos => {
            //     const identicalPositions = unit[t]!.filter(p => p.uri && p.uri === pos.uri)
            //     if (identicalPositions.length >= 2) {
            //         identicalPositions.filter()
            //     }
            //     return true
            // })
    }
    const ans = rfdc()(cache)
    for (const type of Object.keys(ans)) {
        const category = ans[type as CacheType]
        if (!category) {
            continue
        }
        for (const id of Object.keys(category)) {
            const unit = category[id] as CacheUnit
            trimPositions(unit, 'dcl')
            trimPositions(unit, 'def')
            if (!unit.dcl?.length && !unit.def?.length) {
                delete category[id]
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

export function setUpUnit(cache: ClientCache | undefined, type: CacheType, id: IdentityNode, defaultValue: CacheUnit = {}) {
    const stringID = id.toString()
    return ((cache = cache ?? {})[type] = cache[type] ?? {})[stringID] = cache[type]![stringID] ?? defaultValue
}

export function getCompletions(cache: ClientCache, type: CacheType, start: number, end: number) {
    const category = getSafeCategory(cache, type)
    const ans: ParserSuggestion[] = []
    for (const id of Object.keys(category)) {
        const unit = category[id] as CacheUnit
        const documentation = unit.doc || undefined
        ans.push({
            ...{ label: id, start, end },
            ...documentation && { documentation: { kind: MarkupKind.Markdown, value: documentation } }
        })
    }
    return ans
}
