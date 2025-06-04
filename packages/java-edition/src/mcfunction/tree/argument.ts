import type * as core from '@spyglassmc/core'
import type * as mcf from '@spyglassmc/mcfunction'

// #region Argument nodes.
export interface BrigadierBoolArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:bool'
}
export interface BrigadierDoubleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:double'
	properties?: { min: number; max: number }
}
export interface BrigadierFloatArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:float'
	properties?: { min: number; max: number }
}
export interface BrigadierIntegerArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:integer'
	properties?: { min: number; max: number }
}
export interface BrigadierLongArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:long'
	properties?: { min: number; max: number }
}
export interface BrigadierStringArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:string'
	properties: { type: 'word' | 'phrase' | 'greedy' }
}
export interface MinecraftAngleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:angle'
}
export interface MinecraftBlockPosArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:block_pos'
}
export interface MinecraftBlockPredicateArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:block_predicate'
}
export interface MinecraftBlockStateArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:block_state'
}
export interface MinecraftColorArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:color'
}
export interface MinecraftColumnPosArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:column_pos'
}
export interface MinecraftComponentArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:component'
}
export interface MinecraftDialogArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:dialog'
}
export interface MinecraftDimensionArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:dimension'
}
export interface MinecraftEntityArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:entity'
	properties: { amount: 'multiple' | 'single'; type: 'entities' | 'players' }
}
export interface MinecraftEntityAnchorArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:entity_anchor'
}
export interface MinecraftEntitySummonArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:entity_summon'
}
export interface RangeProperties extends Record<string, unknown> {
	min: number
	max: number
	minSpan: number
	maxSpan: number
}
export interface MinecraftFloatRangeArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:float_range'
	properties?: RangeProperties
}
export interface MinecraftFunctionArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:function'
}
export interface MinecraftGamemodeArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:gamemode'
}
export interface MinecraftGameProfileArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:game_profile'
}
export interface MinecraftHeightmapArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:heightmap'
}
export interface MinecraftIntRangeArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:int_range'
	properties?: RangeProperties
}
export interface MinecraftItemEnchantmentArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:item_enchantment'
}
export interface MinecraftItemPredicateArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:item_predicate'
}
export interface MinecraftItemSlotArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:item_slot'
}
export interface MinecraftItemSlotsArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:item_slots'
}
export interface MinecraftItemStackArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:item_stack'
}
export interface MinecraftLootModifierArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:loot_modifier'
}
export interface MinecraftLootPredicateArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:loot_predicate'
}
export interface MinecraftLootTableArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:loot_table'
}
export interface MinecraftMessageArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:message'
}
export interface MinecraftMobEffectArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:mob_effect'
}
export interface NbtParserProperties extends Record<string, unknown> {
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
	 * @see {@link NbtParserProperties.dispatcher}
	 */
	dispatchedBy: string
	/**
	 * The name of an NBT path argument.
	 *
	 * @see {@link NbtParserProperties.dispatcher}
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
export interface MinecraftNbtCompoundTagArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:nbt_compound_tag'
	properties?: NbtParserProperties
}
export interface MinecraftNbtPathArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:nbt_path'
	properties?: NbtParserProperties
}
export interface MinecraftNbtTagArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:nbt_tag'
	properties?: NbtParserProperties
}
export interface MinecraftObjectiveArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:objective'
}
export interface MinecraftObjectiveCriteriaArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:objective_criteria'
}
export interface MinecraftOperationArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:operation'
}
export interface MinecraftParticleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:particle'
}
export interface MinecraftResourceArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource'
	properties: { registry: string }
}
export interface MinecraftResourceKeyArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource_key'
	properties: { registry: string }
}
export interface MinecraftResourceLocationArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource_location'
	properties?: core.ResourceLocationOptions
}
export interface MinecraftResourceOrTagArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource_or_tag'
	properties: { registry: string }
}
export interface MinecraftResourceOrTagKeyArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource_or_tag_key'
	properties: { registry: string }
}
export interface MinecraftResourceSelectorTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:resource_selector'
	properties: { registry: string }
}
export interface MinecraftRotationArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:rotation'
}
export interface MinecraftScoreHolderArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:score_holder'
	properties: {
		usageType: core.SymbolUsageType
		amount: 'single' | 'multiple'
	}
}
export interface MinecraftScoreboardSlotArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:scoreboard_slot'
}
export interface MinecraftStyleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:style'
}
export interface MinecraftSwizzleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:swizzle'
}
export interface MinecraftTeamArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:team'
}
export interface MinecraftTemplateMirrorArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:template_mirror'
}
export interface MinecraftTemplateRotationArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:template_rotation'
}
export interface MinecraftTimeArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:time'
}
export interface MinecraftUuidArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:uuid'
	properties?: Partial<core.SymbolOptions>
}
export interface MinecraftVec2ArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:vec2'
}
export interface MinecraftVec3ArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:vec3'
}
export interface SpyglassmcCriterionArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'spyglassmc:criterion'
}
export interface SpyglassmcTagArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'spyglassmc:tag'
}
// #endregion

export type ArgumentTreeNode =
	| BrigadierBoolArgumentTreeNode
	| BrigadierDoubleArgumentTreeNode
	| BrigadierFloatArgumentTreeNode
	| BrigadierIntegerArgumentTreeNode
	| BrigadierLongArgumentTreeNode
	| BrigadierStringArgumentTreeNode
	| MinecraftAngleArgumentTreeNode
	| MinecraftBlockPosArgumentTreeNode
	| MinecraftBlockPredicateArgumentTreeNode
	| MinecraftBlockStateArgumentTreeNode
	| MinecraftColorArgumentTreeNode
	| MinecraftColumnPosArgumentTreeNode
	| MinecraftComponentArgumentTreeNode
	| MinecraftDialogArgumentTreeNode
	| MinecraftDimensionArgumentTreeNode
	| MinecraftEntityArgumentTreeNode
	| MinecraftEntityAnchorArgumentTreeNode
	| MinecraftEntitySummonArgumentTreeNode
	| MinecraftFloatRangeArgumentTreeNode
	| MinecraftFunctionArgumentTreeNode
	| MinecraftGamemodeArgumentTreeNode
	| MinecraftGameProfileArgumentTreeNode
	| MinecraftHeightmapArgumentTreeNode
	| MinecraftIntRangeArgumentTreeNode
	| MinecraftItemEnchantmentArgumentTreeNode
	| MinecraftItemPredicateArgumentTreeNode
	| MinecraftItemSlotArgumentTreeNode
	| MinecraftItemSlotsArgumentTreeNode
	| MinecraftItemStackArgumentTreeNode
	| MinecraftLootModifierArgumentTreeNode
	| MinecraftLootPredicateArgumentTreeNode
	| MinecraftLootTableArgumentTreeNode
	| MinecraftMessageArgumentTreeNode
	| MinecraftMobEffectArgumentTreeNode
	| MinecraftNbtCompoundTagArgumentTreeNode
	| MinecraftNbtPathArgumentTreeNode
	| MinecraftNbtTagArgumentTreeNode
	| MinecraftObjectiveArgumentTreeNode
	| MinecraftObjectiveCriteriaArgumentTreeNode
	| MinecraftOperationArgumentTreeNode
	| MinecraftParticleArgumentTreeNode
	| MinecraftResourceArgumentTreeNode
	| MinecraftResourceKeyArgumentTreeNode
	| MinecraftResourceLocationArgumentTreeNode
	| MinecraftResourceOrTagArgumentTreeNode
	| MinecraftResourceOrTagKeyArgumentTreeNode
	| MinecraftResourceSelectorTreeNode
	| MinecraftRotationArgumentTreeNode
	| MinecraftScoreHolderArgumentTreeNode
	| MinecraftScoreboardSlotArgumentTreeNode
	| MinecraftStyleArgumentTreeNode
	| MinecraftSwizzleArgumentTreeNode
	| MinecraftTeamArgumentTreeNode
	| MinecraftTemplateMirrorArgumentTreeNode
	| MinecraftTemplateRotationArgumentTreeNode
	| MinecraftTimeArgumentTreeNode
	| MinecraftUuidArgumentTreeNode
	| MinecraftVec2ArgumentTreeNode
	| MinecraftVec3ArgumentTreeNode
	| SpyglassmcCriterionArgumentTreeNode
	| SpyglassmcTagArgumentTreeNode
