import type * as core from '@spyglassmc/core'
import type * as mcf from '@spyglassmc/mcfunction'

// #region Argument nodes.
export interface MinecraftBoolArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:bool'
}
export interface MinecraftDoubleArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:double'
	min: number
	max: number
}
export interface MinecraftFloatArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:float'
	min: number
	max: number
}
export interface MinecraftIntegerArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:integer'
	min: number
	max: number
}
export interface MinecraftLongArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:long'
	min: number
	max: number
}
export interface MinecraftGreedyStringArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:greedy_string'
}
export interface MinecraftQuotedStringArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:quoted_string'
}
export interface MinecraftWordArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:word'
}
export interface MinecraftAngleArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:angle'
}
export interface MinecraftBlockPosArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:block_pos'
}
export interface MinecraftBlockPredicateArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:block_predicate'
}
export interface MinecraftBlockStateArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:block_state'
}
export interface MinecraftColorArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:color'
}
export interface MinecraftColumnPosArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:column_pos'
}
export interface MinecraftComponentArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:component'
}
export interface MinecraftContextFloatProviderArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:context_float_provider'
}
export interface MinecraftContextIntProviderArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:context_int_provider'
}
export interface MinecraftDialogArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:dialog'
}
export interface MinecraftDimensionArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:dimension'
}
export interface MinecraftEntityArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:entity'
	single_result?: boolean
	players_only?: boolean
}
export interface MinecraftEntityAnchorArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:entity_anchor'
}
export interface MinecraftEntitySummonArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:entity_summon'
}
export interface MinecraftFeatureArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:feature'
}
export interface RangeProperties extends mcf.ArgumentTreeData {
	min: number
	max: number
	minSpan: number
	maxSpan: number
}
export interface MinecraftFloatRangeArgumentTreeData extends RangeProperties {
	type: 'minecraft:float_range'
}
export interface MinecraftFunctionArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:function'
}
export interface MinecraftGamemodeArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:gamemode'
}
export interface MinecraftGameProfileArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:game_profile'
}
export interface MinecraftHeightmapArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:heightmap'
}
export interface MinecraftIntRangeArgumentTreeData extends RangeProperties {
	type: 'minecraft:int_range'
}
export interface MinecraftItemEnchantmentArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:item_enchantment'
}
export interface MinecraftItemPredicateArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:item_predicate'
}
export interface MinecraftItemSlotArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:item_slot'
}
export interface MinecraftItemSlotsArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:item_slots'
}
export interface MinecraftItemStackArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:item_stack'
}
export interface MinecraftLootModifierArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:loot_modifier'
}
export interface MinecraftLootPredicateArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:loot_predicate'
}
export interface MinecraftLootTableArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:loot_table'
}
export interface MinecraftMessageArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:message'
}
export interface MinecraftMobEffectArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:mob_effect'
}
export interface NbtParserOptions extends Record<string, unknown> {
	/**
	 * The NBT checker should check this argument by dispatching on `dispatcher`
	 * with a static index inferred from the argument with the name `dispatchedBy`
	 * and optionally indexing on the dispatched type by indices inferred from the
	 * argument named by `indexedBy`.
	 */
	dispatcher:
		| 'minecraft:block'
		| 'minecraft:entity'
		| 'minecraft:storage'
		| 'minecraft:macro_function'
	/**
	 * The name of a vec3, an entity, an entity resource location, or a
	 * storage resource location argument.
	 *
	 * @see {@link NbtParserOptions.dispatcher}
	 */
	dispatchedBy: string
	/**
	 * The name of an NBT path argument.
	 *
	 * @see {@link NbtParserOptions.dispatcher}
	 */
	indexedBy?: string
	/**
	 * @default {@link core.SymbolAccessType.Read}
	 */
	accessType?: core.SymbolAccessType
	/**
	 * `true` if the NBT checker should check this argument as a predicate. In a
	 * predicate NBT argument, keys can be missing, resource location strings must
	 * include the default namespace and numbers must have the exact type match.
	 */
	isPredicate?: boolean
	/**
	 * `true` if the NBT checker should check this argument as a merge. In a
	 * merge NBT argument, keys can be missing.
	 */
	isMerge?: boolean
	/**
	 * `true` if the NBT checker should check this type using the list item of
	 * {@link indexedBy}
	 */
	isListIndex?: boolean
}
export interface MinecraftNbtCompoundTagArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:nbt_compound_tag'
	options?: NbtParserOptions
}
export interface MinecraftNbtPathArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:nbt_path'
	options?: NbtParserOptions
}
export interface MinecraftNbtTagArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:nbt_tag'
	options?: NbtParserOptions
}
export interface MinecraftObjectiveArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:objective'
}
export interface MinecraftObjectiveCriteriaArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:objective_criteria'
}
export interface MinecraftOperationArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:operation'
}
export interface MinecraftParticleArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:particle'
}
export interface MinecraftPatternStringArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:pattern'
	pattern: string
}
export interface MinecraftResourceArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:resource'
	registry: string
}
export interface MinecraftResourceLocationArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:resource_location'
	options?: core.ResourceLocationOptions
}
export interface MinecraftResourceOrTagArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:resource_or_tag'
	registry: string
}
export interface MinecraftResourceSelectorArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:resource_selector'
	registry: string
}
export interface MinecraftRotationArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:rotation'
}
export interface MinecraftScoreHolderArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:score_holder'
	usageType: core.SymbolUsageType
	multiple?: boolean
}
export interface MinecraftScoreboardSlotArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:scoreboard_slot'
}
export interface MinecraftSlotSourceArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:slot_source'
}
export interface MinecraftStyleArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:style'
}
export interface MinecraftSwizzleArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:swizzle'
}
export interface MinecraftTeamArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:team'
}
export interface MinecraftTeamColorArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:team_color'
}
export interface MinecraftTemplateMirrorArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:template_mirror'
}
export interface MinecraftTemplateRotationArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:template_rotation'
}
export interface MinecraftTimeArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:time'
	min?: number
	max?: number
}
export interface MinecraftUuidArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:uuid'
	options?: Partial<core.SymbolOptions>
}
export interface MinecraftVec2ArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:vec2'
}
export interface MinecraftVec3ArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'minecraft:vec3'
}
export interface SpyglassmcCriterionArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'spyglassmc:criterion'
}
export interface SpyglassmcTagArgumentTreeData extends mcf.ArgumentTreeData {
	type: 'spyglassmc:tag'
}
// #endregion

export type ArgumentTreeData =
	| MinecraftBoolArgumentTreeData
	| MinecraftDoubleArgumentTreeData
	| MinecraftFloatArgumentTreeData
	| MinecraftIntegerArgumentTreeData
	| MinecraftLongArgumentTreeData
	| MinecraftGreedyStringArgumentTreeData
	| MinecraftQuotedStringArgumentTreeData
	| MinecraftWordArgumentTreeData
	| MinecraftAngleArgumentTreeData
	| MinecraftBlockPosArgumentTreeData
	| MinecraftBlockPredicateArgumentTreeData
	| MinecraftBlockStateArgumentTreeData
	| MinecraftColorArgumentTreeData
	| MinecraftColumnPosArgumentTreeData
	| MinecraftComponentArgumentTreeData
	| MinecraftContextIntProviderArgumentTreeData
	| MinecraftContextFloatProviderArgumentTreeData
	| MinecraftDialogArgumentTreeData
	| MinecraftDimensionArgumentTreeData
	| MinecraftEntityArgumentTreeData
	| MinecraftEntityAnchorArgumentTreeData
	| MinecraftEntitySummonArgumentTreeData
	| MinecraftFeatureArgumentTreeData
	| MinecraftFloatRangeArgumentTreeData
	| MinecraftFunctionArgumentTreeData
	| MinecraftGamemodeArgumentTreeData
	| MinecraftGameProfileArgumentTreeData
	| MinecraftHeightmapArgumentTreeData
	| MinecraftIntRangeArgumentTreeData
	| MinecraftItemEnchantmentArgumentTreeData
	| MinecraftItemPredicateArgumentTreeData
	| MinecraftItemSlotArgumentTreeData
	| MinecraftItemSlotsArgumentTreeData
	| MinecraftItemStackArgumentTreeData
	| MinecraftLootModifierArgumentTreeData
	| MinecraftLootPredicateArgumentTreeData
	| MinecraftLootTableArgumentTreeData
	| MinecraftMessageArgumentTreeData
	| MinecraftMobEffectArgumentTreeData
	| MinecraftNbtCompoundTagArgumentTreeData
	| MinecraftNbtPathArgumentTreeData
	| MinecraftNbtTagArgumentTreeData
	| MinecraftObjectiveArgumentTreeData
	| MinecraftObjectiveCriteriaArgumentTreeData
	| MinecraftOperationArgumentTreeData
	| MinecraftParticleArgumentTreeData
	| MinecraftPatternStringArgumentTreeData
	| MinecraftResourceArgumentTreeData
	| MinecraftResourceLocationArgumentTreeData
	| MinecraftResourceOrTagArgumentTreeData
	| MinecraftResourceSelectorArgumentTreeData
	| MinecraftRotationArgumentTreeData
	| MinecraftScoreHolderArgumentTreeData
	| MinecraftScoreboardSlotArgumentTreeData
	| MinecraftSlotSourceArgumentTreeData
	| MinecraftStyleArgumentTreeData
	| MinecraftSwizzleArgumentTreeData
	| MinecraftTeamArgumentTreeData
	| MinecraftTeamColorArgumentTreeData
	| MinecraftTemplateMirrorArgumentTreeData
	| MinecraftTemplateRotationArgumentTreeData
	| MinecraftTimeArgumentTreeData
	| MinecraftUuidArgumentTreeData
	| MinecraftVec2ArgumentTreeData
	| MinecraftVec3ArgumentTreeData
	| SpyglassmcCriterionArgumentTreeData
	| SpyglassmcTagArgumentTreeData
