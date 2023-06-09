import type * as core from '@spyglassmc/core'
import type * as mcf from '@spyglassmc/mcfunction'

// #region Argument nodes.
export interface BrigadierBoolArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:bool'
}
export interface BrigadierDoubleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:double'
	properties?: {
		min: number
		max: number
	}
}
export interface BrigadierFloatArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:float'
	properties?: {
		min: number
		max: number
	}
}
export interface BrigadierIntegerArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:integer'
	properties?: {
		min: number
		max: number
	}
}
export interface BrigadierLongArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:long'
	properties?: {
		min: number
		max: number
	}
}
export interface BrigadierStringArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'brigadier:string'
	properties: {
		type: 'word' | 'phrase' | 'greedy'
	}
}
export interface MinecraftAngleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:angle'
}
export interface MinecraftBlockPosArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:block_pos'
}
export interface MinecraftBlockPredicateArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:block_predicate'
}
export interface MinecraftBlockStateArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:block_state'
}
export interface MinecraftColorArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:color'
}
export interface MinecraftColumnPosArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:column_pos'
}
export interface MinecraftComponentArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:component'
}
export interface MinecraftDimensionArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:dimension'
}
export interface MinecraftEntityArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:entity'
	properties: {
		amount: 'multiple' | 'single'
		type: 'entities' | 'players'
	}
}
export interface MinecraftEntityAnchorArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:entity_anchor'
}
export interface MinecraftEntitySummonArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:entity_summon'
}
export interface MinecraftFloatRangeArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:float_range'
}
export interface MinecraftFunctionArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:function'
}
export interface MinecraftGameProfileArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:game_profile'
}
export interface MinecraftIntRangeArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:int_range'
}
export interface MinecraftItemEnchantmentArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:item_enchantment'
}
export interface MinecraftItemPredicateArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:item_predicate'
}
export interface MinecraftItemSlotArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:item_slot'
}
export interface MinecraftItemStackArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:item_stack'
}
export interface MinecraftMessageArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:message'
}
export interface MinecraftMobEffectArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:mob_effect'
}
export interface MinecraftNbtCompoundTagArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:nbt_compound_tag'
}
export interface MinecraftNbtPathArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:nbt_path'
}
export interface MinecraftNbtTagArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:nbt_tag'
}
export interface MinecraftObjectiveArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:objective'
}
export interface MinecraftObjectiveCriteriaArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:objective_criteria'
}
export interface MinecraftOperationArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:operation'
}
export interface MinecraftParticleArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:particle'
}
export interface MinecraftResourceArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:resource'
	properties: {
		registry: string
	}
}
export interface MinecraftResourceLocationArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:resource_location'
	properties?: core.ResourceLocationOptions
}
export interface MinecraftResourceOrTagArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:resource_or_tag'
	properties: {
		registry: string
	}
}
export interface MinecraftRotationArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:rotation'
}
export interface MinecraftScoreHolderArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:score_holder'
	properties: {
		amount: 'single' | 'multiple'
	}
}
export interface MinecraftScoreboardSlotArgumentTreeNode
	extends mcf.ArgumentTreeNode
{
	parser: 'minecraft:scoreboard_slot'
}
export interface MinecraftSwizzleArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:swizzle'
}
export interface MinecraftTeamArgumentTreeNode extends mcf.ArgumentTreeNode {
	parser: 'minecraft:team'
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
	| MinecraftDimensionArgumentTreeNode
	| MinecraftEntityArgumentTreeNode
	| MinecraftEntityAnchorArgumentTreeNode
	| MinecraftEntitySummonArgumentTreeNode
	| MinecraftFloatRangeArgumentTreeNode
	| MinecraftFunctionArgumentTreeNode
	| MinecraftGameProfileArgumentTreeNode
	| MinecraftIntRangeArgumentTreeNode
	| MinecraftItemEnchantmentArgumentTreeNode
	| MinecraftItemPredicateArgumentTreeNode
	| MinecraftItemSlotArgumentTreeNode
	| MinecraftItemStackArgumentTreeNode
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
	| MinecraftResourceLocationArgumentTreeNode
	| MinecraftResourceOrTagArgumentTreeNode
	| MinecraftRotationArgumentTreeNode
	| MinecraftScoreHolderArgumentTreeNode
	| MinecraftScoreboardSlotArgumentTreeNode
	| MinecraftSwizzleArgumentTreeNode
	| MinecraftTeamArgumentTreeNode
	| MinecraftTimeArgumentTreeNode
	| MinecraftUuidArgumentTreeNode
	| MinecraftVec2ArgumentTreeNode
	| MinecraftVec3ArgumentTreeNode
	| SpyglassmcTagArgumentTreeNode
