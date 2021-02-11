import { Location } from './Location'

const TagFileCategories = Object.freeze([
	'tag/block',
	'tag/entity_type',
	'tag/fluid',
	'tag/function',
	'tag/game_event',
	'tag/item',
] as const)
const WorldgenFileCategories = Object.freeze([
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
const FileCategories = Object.freeze([
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
const MiscCategories = Object.freeze([
	'bossbar',
	'entity',
	'objective',
	'score_holder',
	'storage',
	'tag',
	'team',
] as const)
const DeclarableCategories = Object.freeze([
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

/**
 * - Key: file path.
 * - Value: `SymbolTable` for declared non-private symbols within the file.
 */
interface SplitSymbolTable<C extends string> {
	[filePath: string]: SymbolTable<C>
}

/**
 * - Key: category name.
 * - Value: `SymbolSubTable` for the specific category.
 */
type SymbolTable<C extends string> = {
	[category in CoreCategories | C]: SymbolSubTable<C>
}

/**
 * - Key: symbol identifier.
 * - Value: the `SymbolBucket` for the identifier.
 */
interface SymbolSubTable<C extends string> {
	[identifier: string]: Symbol<C>
}

/**
 * File paths in def/dec/imp/ref/typedef shall not be a different file than in `SplitSymbolTable`, unless it's in a merged `SymbolTable`.
 */
interface Symbol<C extends string> {
	category: CoreCategories | C,
	name: string,
	def?: Location[],
	dec?: Location[],
	imp?: Location[],
	ref?: Location[],
	typedef?: Location[],
}

interface SymbolAddition<C extends string> {
	category: CoreCategories | C,
	name: string, 
	type: SymbolType,
	visibility: SymbolVisibility
}

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
}

type SymbolTableStack<C extends string> = SymbolTable<C>[]

export class SymbolTableHelper<C extends string> {
	constructor(
		public readonly global: SplitSymbolTable<C>,
		public readonly currentFile: SymbolTableStack<C>
	) { }

	addSymbol(symbol: Symbol<C>) {
		
	}
}
