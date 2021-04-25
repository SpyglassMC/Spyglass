import type * as core from '@spyglassmc/core'
import type { CommandChildBaseNode } from './command'

export interface BrigadierBoolArgumentNode extends CommandChildBaseNode, core.BooleanBaseNode {
	type: 'mcfunction:argument/brigadier:bool',
}
export interface BrigadierDoubleArgumentNode extends CommandChildBaseNode, core.FloatBaseNode {
	type: 'mcfunction:argument/brigadier:double',
}
export interface BrigadierFloatArgumentNode extends CommandChildBaseNode, core.FloatBaseNode {
	type: 'mcfunction:argument/brigadier:float',
}
export interface BrigadierIntegerArgumentNode extends CommandChildBaseNode, core.IntegerBaseNode {
	type: 'mcfunction:argument/brigadier:integer',
}
export interface BrigadierLongArgumentNode extends CommandChildBaseNode, core.IntegerBaseNode {
	type: 'mcfunction:argument/brigadier:long',
}
export interface BrigadierStringArgumentNode extends CommandChildBaseNode, core.StringBaseNode {
	type: 'mcfunction:argument/brigadier:string',
}
export interface MinecraftAngleArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:angle',
}
export interface MinecraftBlockPosArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:block_pos',
}
export interface MinecraftBlockPredicateArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:block_predicate',
}
export interface MinecraftBlockStateArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:block_state',
}
export interface MinecraftColorArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:color',
}
export interface MinecraftColumnPosArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:column_pos',
}
export interface MinecraftComponentArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:component',
}
export interface MinecraftDimensionArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:dimension',
}
export interface MinecraftEntityArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:entity',
}
export interface MinecraftEntityAnchorArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:entity_anchor',
}
export interface MinecraftEntitySummonArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:entity_summon',
}
export interface MinecraftFloatRangeArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:float_range',
}
export interface MinecraftFunctionArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:function',
}
export interface MinecraftGameProfileArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:game_profile',
}
export interface MinecraftIntRangeArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:int_range',
}
export interface MinecraftItemEnchantmentArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:item_enchantment',
}
export interface MinecraftItemPredicateArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:item_predicate',
}
export interface MinecraftItemSlotArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:item_slot',
}
export interface MinecraftItemStackArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:item_stack',
}
export interface MinecraftMessageArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:message',
}
export interface MinecraftMobEffectArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:mob_effect',
}
export interface MinecraftNbtCompoundTagArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:nbt_compound_tag',
}
export interface MinecraftNbtPathArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:nbt_path',
}
export interface MinecraftNbtTagArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:nbt_tag',
}
export interface MinecraftObjectiveArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:objective',
}
export interface MinecraftObjectiveCriteriaArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:objective_criteria',
}
export interface MinecraftOperationArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:operation',
}
export interface MinecraftParticleArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:particle',
}
export interface MinecraftResourceLocationArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:resource_location',
}
export interface MinecraftRotationArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:rotation',
}
export interface MinecraftScoreHolderArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:score_holder',
}
export interface MinecraftScoreboardSlotArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:scoreboard_slot',
}
export interface MinecraftSwizzleArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:swizzle',
}
export interface MinecraftTeamArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:team',
}
export interface MinecraftTimeArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:time',
}
export interface MinecraftUuidArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:uuid',
}
export interface MinecraftVec2ArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:vec2',
}
export interface MinecraftVec3ArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/minecraft:vec3',
}
export interface SpyglassmcSymbolArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/spyglassmc:symbol',
}
export interface SpyglassmcUnknownArgumentNode extends CommandChildBaseNode {
	type: 'mcfunction:argument/spyglassmc:unknown',
	value: string,
}

export type ArgumentNode =
	| BrigadierBoolArgumentNode
	| BrigadierDoubleArgumentNode
	| BrigadierFloatArgumentNode
	| BrigadierIntegerArgumentNode
	| BrigadierLongArgumentNode
	| BrigadierStringArgumentNode
	| MinecraftAngleArgumentNode
	| MinecraftBlockPosArgumentNode
	| MinecraftBlockPredicateArgumentNode
	| MinecraftBlockStateArgumentNode
	| MinecraftColorArgumentNode
	| MinecraftColumnPosArgumentNode
	| MinecraftComponentArgumentNode
	| MinecraftDimensionArgumentNode
	| MinecraftEntityArgumentNode
	| MinecraftEntityAnchorArgumentNode
	| MinecraftEntitySummonArgumentNode
	| MinecraftFloatRangeArgumentNode
	| MinecraftFunctionArgumentNode
	| MinecraftGameProfileArgumentNode
	| MinecraftIntRangeArgumentNode
	| MinecraftItemEnchantmentArgumentNode
	| MinecraftItemPredicateArgumentNode
	| MinecraftItemSlotArgumentNode
	| MinecraftItemStackArgumentNode
	| MinecraftMessageArgumentNode
	| MinecraftMobEffectArgumentNode
	| MinecraftNbtCompoundTagArgumentNode
	| MinecraftNbtPathArgumentNode
	| MinecraftNbtTagArgumentNode
	| MinecraftObjectiveArgumentNode
	| MinecraftObjectiveCriteriaArgumentNode
	| MinecraftOperationArgumentNode
	| MinecraftParticleArgumentNode
	| MinecraftResourceLocationArgumentNode
	| MinecraftRotationArgumentNode
	| MinecraftScoreHolderArgumentNode
	| MinecraftScoreboardSlotArgumentNode
	| MinecraftSwizzleArgumentNode
	| MinecraftTeamArgumentNode
	| MinecraftTimeArgumentNode
	| MinecraftUuidArgumentNode
	| MinecraftVec2ArgumentNode
	| MinecraftVec3ArgumentNode
	| SpyglassmcSymbolArgumentNode
	| SpyglassmcUnknownArgumentNode
