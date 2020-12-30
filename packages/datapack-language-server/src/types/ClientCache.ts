import rfdc from 'rfdc'
import { MarkupKind, Position } from 'vscode-languageserver'
import { URI as Uri } from 'vscode-uri'
import { Config } from '.'
import { IdentityNode } from '../nodes'
import { DatapackLanguageService } from '../services/DatapackLanguageService'
import { IndexMapping } from './IndexMapping'
import { ParserSuggestion } from './ParserSuggestion'
import { remapTextRange, TextRange } from './TextRange'

export const CacheVersion = 11

export const DefaultCacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: CacheVersion }

export interface CacheFile {
	cache: ClientCache,
	files: {
		[uri: string]: number | undefined
	},
	version: number
}

export const TagFileTypes = [
	'tag/block',
	'tag/entity_type',
	'tag/fluid',
	'tag/function',
	'tag/game_event',
	'tag/item',
] as const
export const WorldgenFileTypes = [
	'worldgen/biome',
	'worldgen/configured_carver',
	'worldgen/configured_decorator',
	'worldgen/configured_feature',
	'worldgen/configured_structure_feature',
	'worldgen/configured_surface_builder',
	'worldgen/noise_settings',
	'worldgen/processor_list',
	'worldgen/template_pool',
] as const
export const FileTypes = [
	'advancement',
	'dimension',
	'dimension_type',
	'function',
	'item_modifier',
	'loot_table',
	'predicate',
	'recipe',
	'structure',
	...TagFileTypes,
	...WorldgenFileTypes,
] as const
export const AliasTypes = [
	'alias/entity',
	'alias/uuid',
	'alias/vector',
] as const
export const InternalTypes = [
	'color',
	...AliasTypes,
] as const
export const MiscTypes = [
	'bossbar',
	'entity',
	'objective',
	'score_holder',
	'storage',
	'tag',
	'team',
] as const
export const DeclarableTypes = [
	...FileTypes,
	...MiscTypes,
] as const
export const CacheTypes = [
	...DeclarableTypes,
	...InternalTypes,
]
export const NamespacedTypes = [
	...FileTypes,
	'bossbar',
	'storage',
] as const

export type TagFileType = typeof TagFileTypes[number]
export type WorldgenFileType = typeof WorldgenFileTypes[number]
export type FileType = typeof FileTypes[number]
export type MiscType = typeof MiscTypes[number]
export type DeclarableType = typeof DeclarableTypes[number]
export type AliasType = typeof AliasTypes[number]
export type InternalType = typeof InternalTypes[number]
export type CacheType = typeof CacheTypes[number]
export type NamespacedType = typeof NamespacedTypes[number]

/**
 * Represent a cache which is used to accelerate renaming and computing completions.
 */
export type ClientCache = Partial<Record<CacheType, CacheCategory>>

export function isTagFileType(value: string): value is TagFileType {
	return TagFileTypes.includes(value as TagFileType)
}
export function isWorldgenRegistryFileType(value: string): value is WorldgenFileType {
	return WorldgenFileTypes.includes(value as WorldgenFileType)
}
export function isFileType(value: string): value is FileType {
	return FileTypes.includes(value as FileType)
}
export function isMiscType(value: CacheType): value is MiscType {
	return MiscTypes.includes(value as MiscType)
}
export function isDeclarableType(value: string): value is DeclarableType {
	return DeclarableTypes.includes(value as DeclarableType)
}
export function isAliasType(value: string): value is AliasType {
	return AliasTypes.includes(value as AliasType)
}
export function isInternalType(value: string): value is InternalType {
	return InternalTypes.includes(value as InternalType)
}
export function isCacheType(value: string): value is CacheType {
	return CacheTypes.includes(value as CacheType)
}
export function isNamespacedType(value: string): value is NamespacedType {
	return NamespacedTypes.includes(value as NamespacedType)
}

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
	doc?: string,
	/**
     * Additional value for this unit. Currently it's only used by aliases.
     */
	foo?: any
} & { [key in CacheUnitPositionType]?: CachePosition[] }

export type CacheVisibility = { pattern: string, type: FileType | '*' }

/**
 * An element in `CacheUnit`.
 */
export interface CachePosition extends TextRange {
	uri?: string,
	/**
     * An array of identities describing the visibility of this element.
     */
	visibility?: CacheVisibility[],
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
				if (overrideUnit.doc !== undefined) {
					ansUnit.doc = overrideUnit.doc
				} else {
					delete ansUnit.doc
				}
				if (overrideUnit.foo !== undefined) {
					ansUnit.foo = overrideUnit.foo
				} else {
					delete ansUnit.foo
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

export function getCacheVisibilities(visibility: 'private' | 'internal' | 'public', definitionType: FileType, definitionID: IdentityNode): CacheVisibility[] {
	const ans: CacheVisibility[] = []
	if (visibility === 'private') {
		ans.push({ type: definitionType, pattern: definitionID.toString() })
	} else if (visibility === 'internal') {
		const namespace = definitionID.getNamespace()
		ans.push({ type: '*', pattern: `${namespace}:**` })
		if (namespace !== IdentityNode.DefaultNamespace) {
			ans.push({ type: '*', pattern: `${IdentityNode.DefaultNamespace}:**` })
		}
	} else if (visibility === 'public') {
		ans.push({ type: '*', pattern: '**' })
	}
	return ans
}

export function testID(service: DatapackLanguageService, visibility: CacheVisibility | CacheVisibility[] | null = [], forType: FileType, forID: IdentityNode, definitionUri: string | undefined, config: Config): boolean {
	if (!visibility) {
		return true
	}
	if (visibility instanceof Array) {
		if (visibility.length) {
			return visibility.some(v => testID(service, v, forType, forID, definitionUri, config))
		} else {
			const defaultConfig = config.env.defaultVisibility
			if (typeof defaultConfig === 'object') {
				return testID(service, defaultConfig, forType, forID, definitionUri, config)
			} else {
				const defIDResult = service.getId(service.parseUri(definitionUri!))
				if (!defIDResult) {
					console.error(`[testID] No ID result for “${definitionUri}” for “${forType} ${forID}”.`)
					return true
				}
				return testID(
					service,
					getCacheVisibilities(defaultConfig, defIDResult.category, defIDResult.id),
					forType, forID, definitionUri, config
				)
			}
		}
	}
	if (visibility.type !== '*' && visibility.type !== forType) {
		return false
	}
	const regex = new RegExp(`^${visibility.pattern
		.replace(/\?/g, '[^:/]')
		.replace(/\*\*\//g, '.{0,}')
		.replace(/\*\*/g, '.{0,}')
		.replace(/\*/g, '[^:/]{0,}')}$`)
	return regex.test(forID.toString()) || regex.test(forID.toShortestString())
}

/**
 * Pure function.
 */
export function getCacheForID(service: DatapackLanguageService, forType: FileType, forID: IdentityNode, config: Config) {
	const trimPositions = (unit: CacheUnit, t: 'dcl' | 'def') => {
		unit[t] = unit[t]?.filter(p => testID(service, p.visibility, forType, forID, p.uri, config))
	}
	const ans = rfdc()(service.cacheFile.cache)
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
			...documentation && { documentation: { kind: MarkupKind.Markdown, value: documentation } },
		})
	}
	return ans
}
