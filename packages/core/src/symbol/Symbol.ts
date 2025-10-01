import rfdc from 'rfdc'
// import { TypedEmitter } from 'tiny-typed-emitter'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { DeepReadonly } from '../common/index.js'
import { isIterable } from '../common/index.js'
import type { RangeLike } from '../source/index.js'
import { Location, PositionRange, Range } from '../source/index.js'

// #region Mcdoc Categories
export const McdocCategories = Object.freeze(['mcdoc', 'mcdoc/dispatcher'] as const)
export type McdocCategory = (typeof McdocCategories)[number]
// #endregion

// #region Registry Categories
// Data in `java-edition/src/binder/index.ts` may need to be updated when this section is changed.
export const RegistryCategories = Object.freeze(
	[
		'activity',
		'armor_material', // Removed
		'attribute',
		'block',
		'block_entity_type',
		'block_predicate_type',
		'block_type',
		'chunk_status',
		'command_argument_type',
		'consume_effect_type',
		'creative_mode_tab',
		'custom_stat',
		'data_component_predicate_type',
		'data_component_type',
		'debug_subscription',
		'decorated_pot_pattern',
		'decorated_pot_patterns', // Removed
		'dialog_action_type',
		'dialog_body_type',
		'dialog_type',
		'enchantment_effect_component_type',
		'enchantment_entity_effect_type',
		'enchantment_level_based_value_type',
		'enchantment_location_based_effect_type',
		'enchantment_provider_type',
		'enchantment_value_effect_type',
		'entity_sub_predicate_type',
		'entity_type',
		'float_provider_type',
		'fluid',
		'game_event',
		'height_provider_type',
		'incoming_rpc_methods',
		'input_control_type',
		'instrument',
		'int_provider_type',
		'item',
		'item_sub_predicate_type', // Removed
		'loot_condition_type',
		'loot_function_type',
		'loot_nbt_provider_type',
		'loot_number_provider_type',
		'loot_pool_entry_type',
		'loot_score_provider_type',
		'map_decoration_type',
		'memory_module_type',
		'menu',
		'mob_effect',
		'motive', // Removed
		'number_format_type',
		'outgoing_rpc_methods',
		'particle_type',
		'point_of_interest_type',
		'pos_rule_test',
		'position_source_type',
		'potion',
		'recipe_book_category',
		'recipe_display',
		'recipe_serializer',
		'recipe_type',
		'rule_block_entity_modifier',
		'rule_test',
		'schedule',
		'sensor_type',
		'slot_display',
		'sound_event',
		'spawn_condition_type',
		'stat_type',
		'test_environment_definition_type',
		'test_function',
		'test_instance_type',
		'trigger_type',
		'ticket_type',
		'villager_profession',
		'villager_type',
		'worldgen/biome_source',
		'worldgen/block_placer_type', // Removed
		'worldgen/block_state_provider_type',
		'worldgen/carver',
		'worldgen/chunk_generator',
		'worldgen/decorator', // Removed
		'worldgen/density_function_type',
		'worldgen/feature',
		'worldgen/feature_size_type',
		'worldgen/foliage_placer_type',
		'worldgen/material_condition',
		'worldgen/material_rule',
		'worldgen/placement_modifier_type',
		'worldgen/pool_alias_binding',
		'worldgen/root_placer_type',
		'worldgen/structure_feature', // Removed
		'worldgen/structure_piece',
		'worldgen/structure_placement',
		'worldgen/structure_pool_element',
		'worldgen/structure_processor',
		'worldgen/structure_type',
		'worldgen/surface_builder', // Removed
		'worldgen/tree_decorator_type',
		'worldgen/trunk_placer_type',
	] as const,
)
export type RegistryCategory = (typeof RegistryCategories)[number]
// #endregion

// #region Data Pack Categories
export const NormalFileCategories = Object.freeze(
	[
		'advancement',
		'banner_pattern',
		'cat_variant',
		'chat_type',
		'chicken_variant',
		'cow_variant',
		'damage_type',
		'dialog',
		'dimension',
		'dimension_type',
		'enchantment',
		'enchantment_provider',
		'frog_variant',
		'function',
		'instrument',
		'item_modifier',
		'jukebox_song',
		'loot_table',
		'painting_variant',
		'pig_variant',
		'predicate',
		'recipe',
		'structure',
		'test_environment',
		'test_instance',
		'trial_spawner',
		'trim_material',
		'trim_pattern',
		'wolf_sound_variant',
		'wolf_variant',
	] as const,
)
export type NormalFileCategory = (typeof NormalFileCategories)[number]

export const WorldgenFileCategories = Object.freeze(
	[
		'worldgen/biome',
		'worldgen/configured_carver',
		'worldgen/configured_feature',
		'worldgen/configured_structure_feature',
		'worldgen/configured_surface_builder',
		'worldgen/density_function',
		'worldgen/flat_level_generator_preset',
		'worldgen/multi_noise_biome_source_parameter_list',
		'worldgen/noise',
		'worldgen/noise_settings',
		'worldgen/placed_feature',
		'worldgen/processor_list',
		'worldgen/structure',
		'worldgen/structure_set',
		'worldgen/template_pool',
		'worldgen/world_preset',
	] as const,
)
export type WorldgenFileCategory = (typeof WorldgenFileCategories)[number]

export const TaggableResourceLocationCategories = Object.freeze(
	[...NormalFileCategories, ...RegistryCategories, ...WorldgenFileCategories] as const,
)
export type TaggableResourceLocationCategory = (typeof TaggableResourceLocationCategories)[number]
export namespace TaggableResourceLocationCategory {
	export function is(category: string): category is TaggableResourceLocationCategory {
		return TaggableResourceLocationCategories.includes(
			category as TaggableResourceLocationCategory,
		)
	}
}

export const TagFileCategories = Object.freeze(
	TaggableResourceLocationCategories.map((key) => `tag/${key}` as const),
)
export type TagFileCategory = (typeof TagFileCategories)[number]

export const DataFileCategories = Object.freeze(
	[...NormalFileCategories, ...TagFileCategories, ...WorldgenFileCategories] as const,
)
export type DataFileCategory = (typeof DataFileCategories)[number]

export const DataMiscCategories = Object.freeze(
	[
		'attribute_modifier',
		'bossbar',
		'jigsaw_block_name',
		'random_sequence',
		'storage',
	] as const,
)
export type DataMiscCategory = (typeof DataMiscCategories)[number]

export const DatapackCategories = Object.freeze(
	[
		'attribute_modifier_uuid',
		'objective',
		'score_holder',
		'tag',
		'team',
		...DataFileCategories,
		...DataMiscCategories,
	] as const,
)
export type DatapackCategory = (typeof DatapackCategories)[number]
// #endregion

// #region Resource Pack Categories
export const AssetsFileCategories = Object.freeze(
	[
		'atlas',
		'block_definition', // blockstates
		'equipment',
		'font',
		'font/ttf',
		'font/otf',
		'font/unihex',
		'gpu_warnlist',
		'item_definition', // items
		'lang',
		'lang/deprecated',
		'model',
		'particle',
		'post_effect',
		'regional_compliancies',
		'shader',
		'shader/fragment',
		'shader/vertex',
		'sound',
		'sounds', // sounds.json
		'texture',
		'texture_meta', // *.png.mcmeta
		'waypoint_style',
	] as const,
)
export type AssetsFileCategory = (typeof AssetsFileCategories)[number]

export const AssetsMiscCategories = Object.freeze(
	[
		'texture_slot',
		'shader_target',
		'translation_key',
	] as const,
)
export type AssetsMiscCategory = (typeof AssetsMiscCategories)[number]

export const ResourcepackCategories = Object.freeze(
	[
		...AssetsMiscCategories,
		...AssetsFileCategories,
	] as const,
)
export type ResourcepackCategory = (typeof ResourcepackCategories)[number]
// #endregion

export const FileCategories = Object.freeze(
	[...DataFileCategories, ...AssetsFileCategories] as const,
)
export type FileCategory = (typeof FileCategories)[number]

export const AllCategories = Object.freeze(
	[
		...DatapackCategories,
		...ResourcepackCategories,
		...McdocCategories,
		...RegistryCategories,
	] as const,
)
export type AllCategory = (typeof AllCategories)[number]

export const ResourceLocationCategories = Object.freeze(
	[
		'mcdoc/dispatcher',
		...DataMiscCategories,
		...AssetsMiscCategories,
		...FileCategories,
		...RegistryCategories,
	] as const,
)
export type ResourceLocationCategory = (typeof ResourceLocationCategories)[number]
export namespace ResourceLocationCategory {
	export function is(category: string): category is ResourceLocationCategory {
		return ResourceLocationCategories.includes(category as ResourceLocationCategory)
	}
}

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

export interface SymbolPath {
	category: string
	path: readonly string[]
}
export namespace SymbolPath {
	export function fromSymbol(symbol: DeepReadonly<Symbol>): SymbolPath
	export function fromSymbol(symbol: DeepReadonly<Symbol> | undefined): SymbolPath | undefined
	export function fromSymbol(symbol: DeepReadonly<Symbol> | undefined): SymbolPath | undefined {
		return symbol ? { category: symbol.category, path: symbol.path } : undefined
	}

	/**
	 * Equivalent {@link SymbolPath}s will always be serialized into the same string value.
	 */
	export function toString(path: SymbolPath): string {
		return JSON.stringify({ category: path.category, path: path.path })
	}
	export function fromString(value: string): SymbolPath {
		return JSON.parse(value)
	}
}

export class SymbolPathCollector {
	readonly #set = new Set<string>()

	add(path: SymbolPath | undefined): void {
		if (!path) {
			return
		}
		this.#set.add(SymbolPath.toString(path))
	}

	has(path: SymbolPath): boolean {
		return this.#set.has(SymbolPath.toString(path))
	}

	collect(): SymbolPath[] {
		return [...this.#set].map(SymbolPath.fromString)
	}
}

export interface SymbolMetadata {
	/**
	 * Custom information about this symbol that cannot be expressed by other fields.
	 */
	data?: unknown
	/**
	 * The documentation for this {@link Symbol}. May be edited by doc comments.
	 */
	desc?: string
	/**
	 * A map of symbols that are related to the current symbol. **Only** symbols defined in the global symbol table
	 * (i.e. visibility is {@link SymbolVisibility.Public} or {@link SymbolVisibility.Restricted}) can be specified in this map.
	 */
	relations?: { aliasOf?: SymbolPath; [relationship: string]: SymbolPath | undefined }
	/**
	 * An optional subcategory. Symbols under the same category but having different
	 * subcategories may be used interchangeablely in certain context. e.g. both
	 * mcdoc struct and mcdoc enums can be used to describe the type of a field,
	 * but cannot be used in a `/function` command, so they should be put in a category
	 * other than `mcdoc` (like `function`), and with different subcategories.
	 */
	subcategory?: string
	/**
	 * The visibility of this `Symbol`. Defaults to {@link SymbolVisibility.Public}.
	 */
	visibility?: SymbolVisibility
	/**
	 * An array of regular expressions in string form. Only exists if `visibility` is set to {@link SymbolVisibility.Restricted}.
	 */
	visibilityRestriction?: string[]
}

export const SymbolUsageTypes = Object.freeze(
	['definition', 'declaration', 'implementation', 'reference', 'typeDefinition'] as const,
)
export type SymbolUsageType = (typeof SymbolUsageTypes)[number]
export namespace SymbolUsageType {
	export function is(value: unknown): value is SymbolUsageType {
		return SymbolUsageTypes.includes(value as SymbolUsageType)
	}
}

export interface Symbol extends SymbolMetadata, Partial<Record<SymbolUsageType, SymbolLocation[]>> {
	/**
	 * The main category of this {@link Symbol}. Symbols in different categories are definitely
	 * independent with each other. e.g. advancements and functions.
	 */
	category: string
	identifier: string
	members?: SymbolMap
	parentMap: SymbolMap
	/**
	 * The parent symbol of this symbol. Does not exist if the current symbol is not a member of another symbol.
	 */
	parentSymbol?: Symbol
	path: readonly string[]
}
export namespace Symbol {
	export function get(
		table: SymbolTable | Iterable<SymbolTable>,
		category: AllCategory,
		...path: [string, ...string[]]
	): Symbol | undefined {
		if (isIterable(table)) {
			for (const t of table) {
				const result = get(t, category, ...path)
				if (result) {
					return result
				}
			}
			return undefined
		}
		const map = table[category]
		for (const p of path) {
		}
		return undefined
	}
}

export interface SymbolLocationMetadata {
	/**
	 * @default SymbolAccessType.Read
	 */
	accessType?: SymbolAccessType
	/**
	 * Whether this symbol location should be skipped during renaming.
	 */
	skipRenaming?: boolean
}

/**
 * - `checker`: Contributed by checkers.
 * - `parser`: Contributed by parsers.
 * - `uri_binder`: Contributed by URI binders.
 * - `symbol_registrar/${id}`: Contributed by symbol registrars.
 */
export type SymbolLocationBuiltInContributor =
	| 'checker'
	| 'parser'
	| 'uri_binder'
	| `symbol_registrar/${string}`

export interface SymbolLocation extends SymbolLocationMetadata {
	uri: string
	/**
	 * The range of this symbol usage. It should contain exactly the symbol identifier itself, with no
	 * whitespaces whatsoever included.
	 *
	 * Does not exist for non-file URIs.
	 */
	range?: Range
	/**
	 * The same range as `range`, but in `PositionRange` form.
	 *
	 * Does not exist for non-file URIs.
	 */
	posRange?: PositionRange
	/**
	 * The range of the full declaration/implementation of this `Symbol`. For example, for the following piece of
	 * mcdoc code,
	 * ```mcdoc
	 * 0123456789012345
	 * struct Foo {}
	 * ```
	 *
	 * The `range` for the Symbol `Foo` is `[7, 10)`, while the `fullRange` for it is `[0, 13)`.
	 *
	 * Does not exist for non-file URIs.
	 */
	fullRange?: Range
	/**
	 * The same range as `fullRange`, but in `PositionRange` form.
	 *
	 * Does not exist for non-file URIs.
	 */
	fullPosRange?: PositionRange
	/**
	 * What this usage is contributed by.
	 *
	 * For a list of default contributors, see {@link SymbolLocationBuiltInContributor}
	 */
	contributor?: string
}
export namespace SymbolLocation {
	/* istanbul ignore next */
	export function create(
		doc: TextDocument,
		range: RangeLike,
		fullRange?: RangeLike,
		contributor?: string,
		additional?: SymbolLocationMetadata,
	): SymbolLocation {
		return {
			...Location.create(doc, range),
			...(fullRange
				? { fullRange: Range.get(fullRange), fullPosRange: PositionRange.from(fullRange, doc) }
				: {}),
			...(contributor ? { contributor } : {}),
			...(additional ? additional : {}),
		}
	}
}

export interface SymbolMap {
	[identifier: string]: Symbol
}

export interface SymbolTable extends Partial<Record<AllCategory, SymbolMap>> {
	[category: string]: SymbolMap | undefined
}

export interface UnlinkedSymbol
	extends
		Omit<Symbol, 'category' | 'identifier' | 'members' | 'parentMap' | 'parentSymbol' | 'path'>
{
	category?: undefined
	identifier?: undefined
	members?: UnlinkedSymbolMap
	parentMap?: undefined
	parentSymbol?: undefined
	path?: undefined
}

export interface UnlinkedSymbolMap {
	[identifier: string]: UnlinkedSymbol
}

export interface UnlinkedSymbolTable extends Partial<Record<AllCategory, UnlinkedSymbolMap>> {
	[category: string]: UnlinkedSymbolMap | undefined
}

export namespace SymbolTable {
	/**
	 * The passed-in parameter `table` won't be mutated.
	 *
	 * @returns An identical symbol table where each Symbol's `parentMap` and `parentSymbol` properties
	 * are set properly.
	 */
	export function link(table: UnlinkedSymbolTable): SymbolTable {
		const linkSymbol = (
			symbol: Symbol,
			parentMap: SymbolMap,
			parentSymbol: Symbol | undefined,
			category: string,
			path: string[],
		) => {
			symbol.category = category
			symbol.identifier = path[path.length - 1]
			symbol.path = path
			symbol.parentMap = parentMap
			if (parentSymbol) {
				symbol.parentSymbol = parentSymbol
			}
			if (symbol.members) {
				linkSymbolMap(symbol.members, symbol, category, path)
			}
		}

		const linkSymbolMap = (
			map: SymbolMap,
			parentSymbol: Symbol | undefined,
			category: string,
			path: string[],
		) => {
			for (const [identifier, childSymbol] of Object.entries(map)) {
				linkSymbol(childSymbol, map, parentSymbol, category, [...path, identifier])
			}
		}

		const ans = rfdc()(table) as SymbolTable

		for (const [category, map] of Object.entries(ans)) {
			linkSymbolMap(map!, undefined, category, [])
		}

		return ans
	}

	/**
	 * The passed-in parameter `table` won't be mutated.
	 *
	 * @returns An identical symbol table where each Symbol's `parentMap` and `parentSymbol` properties
	 * are deleted.
	 */
	export function unlink(table: SymbolTable): UnlinkedSymbolTable {
		const unlinkSymbol = (symbol: UnlinkedSymbol) => {
			delete symbol.category
			delete symbol.identifier
			delete symbol.parentMap
			delete symbol.parentSymbol
			delete symbol.path
			if (symbol.members) {
				unlinkSymbolMap(symbol.members)
			}
		}

		const unlinkSymbolMap = (map: UnlinkedSymbolMap) => {
			for (const childSymbol of Object.values(map)) {
				unlinkSymbol(childSymbol)
			}
		}

		const ans = rfdc({ circles: true })(table) as UnlinkedSymbolTable

		for (const map of Object.values(ans)) {
			unlinkSymbolMap(map!)
		}

		return ans
	}

	/**
	 * @returns A serialized string representation of this symbol table. It can be turned back into
	 * a symbol table through the {@link deserialize} method.
	 */
	export function serialize(table: SymbolTable): string {
		return JSON.stringify(unlink(table))
	}

	/**
	 * @returns The symbol table represented by the string returned by the {@link serialize} method.
	 */
	export function deserialize(json: string): SymbolTable {
		return link(JSON.parse(json))
	}
}

// interface SymbolEvent {
// 	symbol: Symbol,
// }
// interface SymbolLocationEvent extends SymbolEvent {
// 	type: SymbolUsageType,
// 	location: SymbolLocation,
// }
// export class CachedSymbolTable extends TypedEmitter<{
// 	symbolCreated: (e: SymbolEvent) => unknown,
// 	symbolAmended: (e: SymbolEvent) => unknown,
// 	symbolRemoved: (e: SymbolEvent) => unknown,
// 	symbolLocationCreated: (e: SymbolLocationEvent) => unknown,
// 	symbolLocationRemoved: (e: SymbolLocationEvent) => unknown,
// }> {
// 	constructor(public readonly table: SymbolTable) {
// 		super()
// 	}
// }
