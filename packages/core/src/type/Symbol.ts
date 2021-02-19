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

const SymbolTypeEnumToSymbolKey = new Map<SymbolType, keyof Symbol<string>>([
	[SymbolType.Definition, 'def'],
	[SymbolType.Declaration, 'dec'],
	[SymbolType.Implementation, 'imp'],
	[SymbolType.Reference, 'ref'],
	[SymbolType.TypeDefinition, 'typedef'],
])

interface SymbolMetadata<C extends string> {
	// Categorical information.
	category: CoreCategories | C,
	name: string,

	// Other information.
	doc?: string,
	visibility?: SymbolVisibility,
	members?: SymbolMap<C>,
}

interface Symbol<C extends string> extends SymbolMetadata<C> {
	def?: Location,
	dec?: Location,
	imp?: Location[],
	ref?: Location[],
	typedef?: Location[],
}

interface SymbolAddition<C extends string> extends SymbolMetadata<C> {
	type: SymbolType,
	location: Location
}

interface SymbolMap<C extends string> {
	[identifier: string]: Symbol<C>
}

type SymbolTable<C extends string> = {
	[category in CoreCategories | C]?: SymbolMap<C>
}

type SymbolTableStack<C extends string> = {
	[category in CoreCategories | C]?: SymbolMap<C>[]
}

interface SplitSymbolTable<C extends string> {
	[filePath: string]: SymbolTable<C>
}

export class SymbolTableHelper<C extends string> {
	public currentFile?: SymbolTableStack<C>

	constructor(
		public readonly global: SplitSymbolTable<C>
	) { }

	addSymbol(symbol: SymbolAddition<C>) {

	}
}
