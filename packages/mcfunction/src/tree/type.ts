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

export interface ArgumentTreeNode extends BaseTreeNode {
	type: 'argument',
	parser: string,
	properties?: {
		[key: string]: unknown,
	},
}

//#region DetailedArgumentTreeNode
// This creates a huge burden for the TypeScript compiler.
// Not sure if we should really use it.
type DetailedArgumentTreeNode = ArgumentTreeNode & ({
	parser: 'brigadier:bool',
} | {
	parser: 'brigadier:double',
	properties?: {
		min: number,
		max: number,
	},
} | {
	parser: 'brigadier:float',
	properties?: {
		min: number,
		max: number,
	},
} | {
	parser: 'brigadier:integer',
	properties?: {
		min: number,
		max: number,
	},
} | {
	parser: 'brigadier:long',
	properties?: {
		min: number,
		max: number,
	},
} | {
	parser: 'brigadier:string',
	properties: {
		type: 'word' | 'phrase' | 'greedy',
	},
} | {
	parser: 'minecraft:angle',
} | {
	parser: 'minecraft:block_pos',
} | {
	parser: 'minecraft:block_predicate',
} | {
	parser: 'minecraft:block_state',
} | {
	parser: 'minecraft:color',
} | {
	parser: 'minecraft:column_pos',
} | {
	parser: 'minecraft:component',
} | {
	parser: 'minecraft:dimension',
} | {
	parser: 'minecraft:entity',
	properties: {
		amount: 'single' | 'multiple',
		type: 'entities' | 'players',
	},
} | {
	parser: 'minecraft:entity_anchor',
} | {
	parser: 'minecraft:entity_summon',
} | {
	parser: 'minecraft:float_range',
} | {
	parser: 'minecraft:function',
} | {
	parser: 'minecraft:game_profile',
} | {
	parser: 'minecraft:int_range',
} | {
	parser: 'minecraft:item_enchantment',
} | {
	parser: 'minecraft:item_predicate',
} | {
	parser: 'minecraft:item_slot',
} | {
	parser: 'minecraft:item_stack',
} | {
	parser: 'minecraft:message',
} | {
	parser: 'minecraft:mob_effect',
} | {
	parser: 'minecraft:nbt_compound_tag',
} | {
	parser: 'minecraft:nbt_path',
} | {
	parser: 'minecraft:nbt_tag',
} | {
	parser: 'minecraft:objective',
	properties?: Partial<SymbolOptions>,
} | {
	parser: 'minecraft:objective_criteria',
} | {
	parser: 'minecraft:operation',
} | {
	parser: 'minecraft:particle',
} | {
	parser: 'minecraft:resource_location',
	properties?: ResourceLocationOptions,
} | {
	parser: 'minecraft:rotation',
} | {
	parser: 'minecraft:score_holder',
	properties: {
		amount: 'single' | 'multiple',
	},
} | {
	parser: 'minecraft:scoreboard_slot',
} | {
	parser: 'minecraft:swizzle',
} | {
	parser: 'minecraft:team',
} | {
	parser: 'minecraft:time',
} | {
	parser: 'minecraft:uuid',
} | {
	parser: 'minecraft:vec2',
} | {
	parser: 'minecraft:vec3',
} | {
	parser: 'spyglassmc:symbol',
	properties: SymbolOptions,
})
//#endregion

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
