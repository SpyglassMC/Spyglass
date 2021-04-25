import type { ResourceLocationOptions, SymbolOptions } from '@spyglassmc/core'

interface BaseTreeNode {
	// The following properties are provided in `commands.json` created by the data generator.
	type: string,
	children?: {
		[name: string]: TreeNode,
	},
	executable?: boolean,
	redirect?: [string],

	// The following properties are custom.
	/**
	 * The permission level required to use this node.
	 * @default 2
	 */
	permission?: 0 | 1 | 2 | 3 | 4,
}

interface BaseArgumentTreeNode extends BaseTreeNode {
	type: 'argument',
	parser: string,
	properties?: Record<string, any>,
}

//#region Argument nodes.
export interface BrigadierBoolArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:bool',
}
export interface BrigadierDoubleArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:double',
	properties?: {
		min: number,
		max: number,
	},
}
export interface BrigadierFloatArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:float',
	properties?: {
		min: number,
		max: number,
	},
}
export interface BrigadierIntegerArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:integer',
	properties?: {
		min: number,
		max: number,
	},
}
export interface BrigadierLongArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:long',
	properties?: {
		min: number,
		max: number,
	},
}
export interface BrigadierStringArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'brigadier:string',
	properties: {
		type: 'word' | 'phrase' | 'greedy',
	},
}
export interface MinecraftAngleArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:angle',
}
export interface MinecraftBlockPosArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:block_pos',
}
export interface MinecraftBlockPredicateArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:block_predicate',
}
export interface MinecraftBlockStateArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:block_state',
}
export interface MinecraftColorArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:color',
}
export interface MinecraftColumnPosArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:column_pos',
}
export interface MinecraftComponentArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:component',
}
export interface MinecraftDimensionArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:dimension',
}
export interface MinecraftEntityArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:entity',
	properties: {
		amount: 'single' | 'multiple',
		type: 'entities' | 'players',
	},
}
export interface MinecraftEntityAnchorArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:entity_anchor',
}
export interface MinecraftEntitySummonArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:entity_summon',
}
export interface MinecraftFloatRangeArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:float_range',
}
export interface MinecraftFunctionArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:function',
}
export interface MinecraftGameProfileArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:game_profile',
}
export interface MinecraftIntRangeArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:int_range',
}
export interface MinecraftItemEnchantmentArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:item_enchantment',
}
export interface MinecraftItemPredicateArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:item_predicate',
}
export interface MinecraftItemSlotArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:item_slot',
}
export interface MinecraftItemStackArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:item_stack',
}
export interface MinecraftMessageArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:message',
}
export interface MinecraftMobEffectArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:mob_effect',
}
export interface MinecraftNbtCompoundTagArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:nbt_compound_tag',
}
export interface MinecraftNbtPathArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:nbt_path',
}
export interface MinecraftNbtTagArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:nbt_tag',
}
export interface MinecraftObjectiveArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:objective',
}
export interface MinecraftObjectiveCriteriaArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:objective_criteria',
}
export interface MinecraftOperationArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:operation',
}
export interface MinecraftParticleArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:particle',
}
export interface MinecraftResourceLocationArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:resource_location',
	properties?: ResourceLocationOptions,
}
export interface MinecraftRotationArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:rotation',
}
export interface MinecraftScoreHolderArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:score_holder',
	properties: {
		amount: 'single' | 'multiple',
	},
}
export interface MinecraftScoreboardSlotArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:scoreboard_slot',
}
export interface MinecraftSwizzleArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:swizzle',
}
export interface MinecraftTeamArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:team',
}
export interface MinecraftTimeArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:time',
}
export interface MinecraftUuidArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:uuid',
	properties?: Partial<SymbolOptions>,
}
export interface MinecraftVec2ArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:vec2',
}
export interface MinecraftVec3ArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'minecraft:vec3',
}
export interface SpyglassmcSymbolArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'spyglassmc:symbol',
	properties: SymbolOptions,
}
/**
 * All argument tree nodes that have an unknown parser will be seen as this one.
 */
export interface SpyglassmcUnknownArgumentTreeNode extends BaseArgumentTreeNode {
	parser: 'spyglassmc:unknown',
}
//#endregion

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
	| MinecraftResourceLocationArgumentTreeNode
	| MinecraftRotationArgumentTreeNode
	| MinecraftScoreHolderArgumentTreeNode
	| MinecraftScoreboardSlotArgumentTreeNode
	| MinecraftSwizzleArgumentTreeNode
	| MinecraftTeamArgumentTreeNode
	| MinecraftTimeArgumentTreeNode
	| MinecraftUuidArgumentTreeNode
	| MinecraftVec2ArgumentTreeNode
	| MinecraftVec3ArgumentTreeNode
	| SpyglassmcSymbolArgumentTreeNode
	| SpyglassmcUnknownArgumentTreeNode

export interface LiteralTreeNode extends BaseTreeNode {
	type: 'literal',
}

export interface RootTreeNode extends BaseTreeNode {
	type: 'root',
}

export type TreeNode =
	| ArgumentTreeNode
	| LiteralTreeNode
	| RootTreeNode

type RecursivePartial<T> = T extends object ? { [K in keyof T]?: RecursivePartial<T[K]> } : T

export type PartialTreeNode = RecursivePartial<TreeNode>
export type PartialRootTreeNode = RecursivePartial<RootTreeNode>
