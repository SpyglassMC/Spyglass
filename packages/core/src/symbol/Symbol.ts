import type { RangeLike } from '../source'
import { Location, Range } from '../source'

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
export const AllCategories = Object.freeze([
	...DeclarableCategories,
	'nbtdoc',
] as const)

export type TagFileCategory = typeof TagFileCategories[number]
export type WorldgenFileCategory = typeof WorldgenFileCategories[number]
export type FileCategory = typeof FileCategories[number]
export type MiscCategory = typeof MiscCategories[number]
export type DeclarableCategory = typeof DeclarableCategories[number]
export type AllCategory = typeof AllCategories[number]

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
	 * Whether this Symbol comes from a default library (e.g. [mc-data][mc-data], [mc-nbtdoc][mc-nbtdoc], or [vanilla-datapack][vanilla-datapack]).
	 * 
	 * [mc-data]: https://github.com/Arcensoth/mc-data
	 * [mc-nbtdoc]: https://github.com/Yurihaia/mc-nbtdoc
	 * [vanilla-datapack]: https://github.com/SPGoding/vanilla-datapack
	 */
	fromDefaultLibrary?: true,
	relations?: {
		[relationship: string]: SymbolPath[],
	},
}

/**
 * @example
 * {
 * 	category: 'advancement',
 * 	path: ['spgoding:foo/bar'],
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
	path: [string, ...string[]],
}
export namespace SymbolPath {
	export function create(category: AllCategory, ...path: [string, ...string[]]): SymbolPath
	export function create(category: string, ...path: [string, ...string[]]): SymbolPath
	export function create(category: string, ...path: [string, ...string[]]): SymbolPath {
		return { category, path }
	}
}

export const SymbolForms = Object.freeze(['definition', 'declaration', 'implementation', 'reference', 'typeDefinition'] as const)
export type SymbolForm = typeof SymbolForms[number]

export interface Symbol extends SymbolMetadata, Partial<Record<SymbolForm, SymbolLocation[]>> {
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
	/**
	 * Whether this Location is contributed by a `UriBinder`.
	 */
	isUriBound?: true,
}
export namespace SymbolLocation {
	/* istanbul ignore next */
	export function create(uri: string, range: RangeLike, fullRange?: RangeLike, isUriBound?: boolean): SymbolLocation {
		return {
			...Location.create(uri, range),
			...fullRange ? { fullRange: Range.get(fullRange) } : {},
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
