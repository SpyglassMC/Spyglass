import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { RangeLike } from '../source'
import { Location, PositionRange, Range } from '../source'

//#region Data Pack Categories
export const TagFileCategories = Object.freeze([
	'tag/block',
	'tag/entity_type',
	'tag/fluid',
	'tag/function',
	'tag/game_event',
	'tag/item',
] as const)
export type TagFileCategory = typeof TagFileCategories[number]

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
export type WorldgenFileCategory = typeof WorldgenFileCategories[number]

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
export type FileCategory = typeof FileCategories[number]

export const MiscCategories = Object.freeze([
	'bossbar',
	'objective',
	'score_holder',
	'storage',
	'tag',
	'team',
] as const)
export type MiscCategory = typeof MiscCategories[number]

export const DatapackCategories = Object.freeze([
	...FileCategories,
	...MiscCategories,
] as const)
export type DatapackCategory = typeof DatapackCategories[number]
//#endregion

//#region NBTDoc Categories
export const NbtdocCategories = Object.freeze([
	'nbtdoc',
])
export type NbtdocCategory = typeof NbtdocCategories[number]
//#endregion

//#region Vanilla Registry Categories
export const VanillaRegistryCategories = Object.freeze([
	'activity',
	'attribute',
	'block',
	'block_entity_type',
	'chunk_status',
	'custom_stat',
	'enchantment',
	'entity_type',
	'float_provider_type',
	'fluid',
	'game_event',
	'height_provider_type',
	'int_provider_type',
	'item',
	'loot_condition_type',
	'loot_function_type',
	'loot_nbt_provider_type',
	'loot_number_provider_type',
	'loot_pool_entry_type',
	'loot_score_provider_type',
	'memory_module_type',
	'menu',
	'mob_effect',
	'motive',
	'particle_type',
	'point_of_interest_type',
	'pos_rule_test',
	'position_source_type',
	'potion',
	'recipe_serializer',
	'recipe_type',
	'rule_test',
	'schedule',
	'sensor_type',
	'sound_event',
	'stat_type',
	'villager_profession',
	'villager_type',
	'worldgen/biome_source',
	'worldgen/block_placer_type',
	'worldgen/block_state_provider_type',
	'worldgen/carver',
	'worldgen/chunk_generator',
	'worldgen/decorator',
	'worldgen/feature',
	'worldgen/feature_size_type',
	'worldgen/foliage_placer_type',
	'worldgen/structure_feature',
	'worldgen/structure_piece',
	'worldgen/structure_pool_element',
	'worldgen/structure_processor',
	'worldgen/surface_builder',
	'worldgen/tree_decorator_type',
	'worldgen/trunk_placer_type',
])
export type VanillaRegistryCategory = typeof VanillaRegistryCategories[number]
//#endregion

export const AllCategories = Object.freeze([
	...DatapackCategories,
	...NbtdocCategories,
	...VanillaRegistryCategories,
] as const)
export type AllCategory = typeof AllCategories[number]

export const enum SymbolAccessType {
	Read,
	Write,
}

export const enum SymbolVisibility {
	Block,
	File,
	Public,
	Restricted,
}

export interface SymbolMetadata {
	// Categorical information.
	identifier: string,
	/**
	 * The main category of this Symbol. Symbols in different categories are definitely
	 * independent with each other. e.g. advancements and functions.
	 */
	category: string,
	/**
	 * An optional subcategory. Symbols under the same category but having different
	 * subcategories may be used interchangeablely in certain context. e.g. both 
	 * nbtdoc compounds and nbtdoc enums can be used to describe the type of a field,
	 * but cannot be used in a `/function` command, so they should be put in a category
	 * other than `function` (like `nbtdoc`), and with different subcategories.
	 */
	subcategory?: string,

	// Other information.
	/**
	 * The visibility of this `Symbol`. Defaults to `SymbolVisibility.Public`.
	 */
	visibility?: SymbolVisibility,
	/**
	 * An array of regular expressions in string form. Only exists if `visibility` is set to `SymbolVisibility.Restricted`.
	 */
	visibilityRestriction?: string[],
	/**
	 * The documentation for this `Symbol`. May be edited by doc comments.
	 */
	doc?: string,
	/**
	 * Whether this Symbol comes from a default library (i.e. [mc-data][mc-data], [mc-nbtdoc][mc-nbtdoc], or [vanilla-datapack][vanilla-datapack]).
	 * 
	 * [mc-data]: https://github.com/Arcensoth/mc-data
	 * [mc-nbtdoc]: https://github.com/Yurihaia/mc-nbtdoc
	 * [vanilla-datapack]: https://github.com/SPGoding/vanilla-datapack
	 */
	fromDefaultLibrary?: true,
	relations?: {
		aliasOf?: Symbol,
		[relationship: string]: Symbol | undefined,
	},
}

export const SymbolUsages = Object.freeze(['definition', 'declaration', 'implementation', 'reference', 'typeDefinition'] as const)
export type SymbolUsage = typeof SymbolUsages[number]

export interface Symbol extends SymbolMetadata, Partial<Record<SymbolUsage, SymbolLocation[]>> {
	members?: SymbolMap,
}

export interface SymbolLocation extends Location {
	/**
	 * The range of the full declaration for this `Symbol`. For example, for the following piece of nbtdoc code,
	 * ```nbtdoc
	 * 0123456789012345
	 * compound Foo {}
	 * ```
	 * 
	 * The `range` for the Symbol `Foo` is `[9, 12)`, while the `fullRange` for it is `[0, 15)`.
	 */
	fullRange?: Range,
	fullPosRange?: PositionRange,
	accessType?: SymbolAccessType,
	/**
	 * Whether this Location is contributed by a `UriBinder`.
	 */
	isUriBound?: true,
}
export namespace SymbolLocation {
	/* istanbul ignore next */
	export function create(doc: TextDocument, range: RangeLike, fullRange?: RangeLike, isUriBound?: boolean): SymbolLocation {
		return {
			...Location.create(doc, range),
			...fullRange ? { fullRange: Range.get(fullRange), fullPosRange: PositionRange.from(fullRange, doc) } : {},
			...isUriBound ? { isUriBound } : {},
		}
	}
}

export interface SymbolMap {
	[identifier: string]: Symbol | undefined,
}

export interface SymbolTable extends Partial<Record<AllCategory, SymbolMap>> {
	[category: string]: SymbolMap | undefined,
}
