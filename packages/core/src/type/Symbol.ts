import { Location } from './Location'

export const TagFileCategories = Object.freeze([
	'tag/block',
	'tag/entity_type',
	'tag/fluid',
	'tag/function',
	'tag/game_event',
	'tag/item',
] as const)
export const WorldgenFileCategories = Object.freeze([
	'worldgen/biome',
	'worldgen/configured_carver',
	'worldgen/configured_decorator',
	'worldgen/configured_feature',
	'worldgen/configured_structure_feature',
	'worldgen/configured_surface_builder',
	'worldgen/noise_settings',
	'worldgen/processor_list',
	'worldgen/template_pool',
] as const)
export const FileCategories = Object.freeze([
	'advancement',
	'dimension',
	'dimension_type',
	'function',
	'item_modifier',
	'loot_table',
	'predicate',
	'recipe',
	'structure',
	...TagFileCategories,
	...WorldgenFileCategories,
] as const)
export const MiscCategories = Object.freeze([
	'bossbar',
	'entity',
	'objective',
	'score_holder',
	'storage',
	'tag',
	'team',
] as const)
export const DeclarableCategories = Object.freeze([
	...FileCategories,
	...MiscCategories,
] as const)
export const CoreCategories = Object.freeze([
	...DeclarableCategories,
] as const)

export type TagFileCategories = typeof TagFileCategories[number]
export type WorldgenFileCategories = typeof WorldgenFileCategories[number]
export type FileCategories = typeof FileCategories[number]
export type MiscCategories = typeof MiscCategories[number]
export type DeclarableCategories = typeof DeclarableCategories[number]
export type CoreCategories = typeof CoreCategories[number]

const enum SymbolType {
	Definition,
	Declaration,
	Implementation,
	Reference,
	TypeDefinition,
}

const enum SymbolVisibility {
	Block,
	File,
	Internal,
	Public,
	Within,
}

const SymbolTypeEnumToSymbolKey = new Map<SymbolType, keyof Symbol>([
	[SymbolType.Definition, 'def'],
	[SymbolType.Declaration, 'dec'],
	[SymbolType.Implementation, 'imp'],
	[SymbolType.Reference, 'ref'],
	[SymbolType.TypeDefinition, 'typedef'],
])

interface SymbolMetadata {
	// Categorical information.
	/**
	 * The main category of this Symbol. Symbols in different categories are definitely
	 * independent with each other. e.g. advancements and functions.
	 */
	category: string,
	/**
	 * An optional subcategory. Symbols under the same category but having different
	 * subcategories may be used interchangeable in certain context. e.g. both 
	 * nbtdoc compounds and nbtdoc enums can be used to describe the type of a field.
	 */
	subcategory?: string,
	name: string,

	// Other information.
	doc?: string,
	visibility?: SymbolVisibility,
	members?: SymbolMap,
	relations?: {
		[type: string]: SymbolPath[],
	},
}

/**
 * @example
 * {
 * 	category: 'advancement',
 * 	path: ['spgoding', 'foo/', 'bar'],
 * }
 * 
 * {
 * 	category: 'nbtdoc',
 * 	path: ['util', 'minecraft', 'InventoryItem', 'Count'],
 * }
 */
export interface SymbolPath {
	category: string,
	/**
	 * Will be resolved as keys of the `members` property of the `Symbol`.
	 */
	path: string[]
}

interface Symbol extends SymbolMetadata {
	def?: Location,
	dec?: Location,
	imp?: Location[],
	ref?: Location[],
	typedef?: Location[],
}

interface SymbolAddition extends SymbolMetadata {
	type: SymbolType,
	location: Location
}

interface SymbolMap {
	[identifier: string]: Symbol
}

interface SymbolTable {
	[category: string]: SymbolMap | undefined
}

interface SymbolTableStack {
	[category: string]: SymbolMap[] | undefined
}

interface SplitSymbolTable {
	[filePath: string]: SymbolTable
}

export class SymbolTableHelper {
	public currentFile?: SymbolTableStack

	constructor(
		public readonly global: SplitSymbolTable
	) { }

	addSymbol(symbol: SymbolAddition) {

	}
}
