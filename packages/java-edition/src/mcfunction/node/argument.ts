import * as core from '@spyglassmc/core'
import type * as nbt from '@spyglassmc/nbt'

export interface BlockStatesNode extends core.RecordBaseNode<core.StringNode, core.StringNode> {
	type: 'mcfunction:block/states'
}
export namespace BlockStatesNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is BlockStatesNode {
		return (node as BlockStatesNode).type === 'mcfunction:block/states'
	}
}
export interface BlockNode extends core.AstNode {
	type: 'mcfunction:block',
	children: (core.ResourceLocationNode | BlockStatesNode | nbt.NbtCompoundNode)[],
	id: core.ResourceLocationNode,
	states?: BlockStatesNode,
	nbt?: nbt.NbtCompoundNode,
}
export namespace BlockNode {
	export function is(node: core.AstNode | undefined): node is BlockNode {
		return (node as BlockNode | undefined)?.type === 'mcfunction:block'
	}

	export function mock(range: core.RangeLike, isPredicate: boolean): BlockNode {
		const id = core.ResourceLocationNode.mock(range, { category: 'block', allowTag: isPredicate })
		return {
			type: 'mcfunction:block',
			range: core.Range.get(range),
			children: [id],
			id,
		}
	}
}

export const CoordinateNotations = ['', '~', '^'] as const
export type CoordinateNodeNotation = typeof CoordinateNotations[number]

export interface CoordinateNode extends core.FloatBaseNode {
	type: 'mcfunction:coordinate',
	notation: CoordinateNodeNotation,
}
export namespace CoordinateNode {
	export function mock(range: core.RangeLike): CoordinateNode {
		return {
			type: 'mcfunction:coordinate',
			range: core.Range.get(range),
			notation: '',
			value: 0,
		}
	}

	/**
	 * @returns A number in the range `[-180.0, 180.0)`.
	 */
	export function toDegree(node: CoordinateNode): number {
		// TODO: For relative coordinates, const value = (node.value + baseCoordinate) % 360
		const value = node.value % 360
		return value >= 180
			? value - 360
			: value < -180 ? value + 360 : value
	}
}

export const enum CoordinateSystem {
	World = 0,
	Local = 1,
}

export interface EntitySelectorAdvancementsArgumentCriteriaNode extends core.RecordBaseNode<core.StringNode, core.BooleanNode> {
	type: 'mcfunction:entity_selector/arguments/advancements/criteria'
}
export interface EntitySelectorAdvancementsArgumentNode extends core.RecordBaseNode<core.ResourceLocationNode, core.BooleanNode | EntitySelectorAdvancementsArgumentCriteriaNode> {
	type: 'mcfunction:entity_selector/arguments/advancements'
}
export interface EntitySelectorScoresArgumentNode extends core.RecordBaseNode<core.SymbolNode, IntRangeNode> {
	type: 'mcfunction:entity_selector/arguments/scores'
}
export interface EntitySelectorInvertableArgumentValueNode<T extends core.AstNode> extends core.SequenceNode<core.LiteralNode | T> {
	type: 'mcfunction:entity_selector/arguments/value/invertable',
	value: T,
	inverted: boolean,
}
export interface EntitySelectorArgumentsNode extends core.RecordBaseNode<core.StringNode, any> {
	type: 'mcfunction:entity_selector/arguments'
}
export namespace EntitySelectorArgumentsNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is EntitySelectorArgumentsNode {
		return (node as EntitySelectorArgumentsNode).type === 'mcfunction:entity_selector/arguments'
	}
}
export const EntitySelectorVariables = ['p', 'a', 'r', 's', 'e']
export type EntitySelectorVariable = typeof EntitySelectorVariables[number]
export const EntitySelectorAtVariables = ['@p', '@a', '@r', '@s', '@e']
export type EntitySelectorAtVariable = typeof EntitySelectorAtVariables[number]
export namespace EntitySelectorVariable {
	/* istanbul ignore next */
	export function is(value: string): value is EntitySelectorVariable {
		return EntitySelectorVariables.includes(value)
	}
}
export interface EntitySelectorNode extends core.SequenceNode<core.LiteralNode | EntitySelectorArgumentsNode> {
	type: 'mcfunction:entity_selector',
	variable?: EntitySelectorVariable,
	argument?: EntitySelectorArgumentsNode,
	currentEntity?: boolean,
	dimensionLimited?: boolean,
	playersOnly?: boolean,
	predicates?: string[],
	chunkLimited?: boolean,
	single?: boolean,
	typeLimited?: boolean,
}
export namespace EntitySelectorNode {
	/* istanbul ignore next */
	export function is(node: core.AstNode): node is EntitySelectorNode {
		return (node as EntitySelectorNode).type === 'mcfunction:entity_selector'
	}
}
export interface EntityNode extends core.AstNode {
	type: 'mcfunction:entity',
	children: (core.StringNode | EntitySelectorNode | UuidNode)[],
	playerName?: core.StringNode,
	selector?: EntitySelectorNode,
	uuid?: UuidNode,
}
export namespace EntityNode {
	export function is(node: core.AstNode | undefined): node is EntityNode {
		return (node as EntityNode | undefined)?.type === 'mcfunction:entity'
	}
}

export interface FloatRangeNode extends core.AstNode {
	type: 'mcfunction:float_range',
	children: (core.FloatNode | core.LiteralNode)[],
	value: [number | undefined, number | undefined],
}

export interface ItemNode extends core.AstNode {
	type: 'mcfunction:item',
	children: (core.ResourceLocationNode | nbt.NbtCompoundNode)[],
	id: core.ResourceLocationNode,
	nbt?: nbt.NbtCompoundNode,
}
export namespace ItemNode {
	export function mock(range: core.RangeLike, isPredicate: boolean): ItemNode {
		const id = core.ResourceLocationNode.mock(range, { category: 'item', allowTag: isPredicate })
		return {
			type: 'mcfunction:item',
			range: core.Range.get(range),
			children: [id],
			id,
		}
	}
}

export interface IntRangeNode extends core.AstNode {
	type: 'mcfunction:int_range',
	children: (core.IntegerNode | core.LiteralNode)[],
	value: [number | undefined, number | undefined],
}
export namespace IntRangeNode {
	export function mock(range: core.RangeLike): IntRangeNode {
		return {
			type: 'mcfunction:int_range',
			range: core.Range.get(range),
			children: [],
			value: [undefined, undefined],
		}
	}
}

export interface MessageNode extends core.AstNode {
	type: 'mcfunction:message',
	children: (core.StringNode | EntitySelectorNode)[],
}

export interface ObjectiveCriteriaNode extends core.AstNode {
	type: 'mcfunction:objective_criteria',
	children?: [core.ResourceLocationNode, core.ResourceLocationNode],
	simpleValue?: string,
}
export namespace ObjectiveCriteriaNode {
	export const SimpleValues = [
		'air', 'armor', 'deathCount', 'dummy', 'food', 'health', 'level',
		'playerKillCount', 'totalKillCount', 'trigger', 'xp',
	]
	export const ComplexCategories = new Map<string, core.RegistryCategory>([
		['broken', 'item'],
		['crafted', 'item'],
		['custom', 'custom_stat'],
		['dropped', 'item'],
		['killed', 'entity_type'],
		['killed_by', 'entity_type'],
		['mined', 'block'],
		['picked_up', 'item'],
		['used', 'item'],
	])
	export const ComplexSep = ':'

	export function mock(range: core.RangeLike): ObjectiveCriteriaNode {
		return {
			type: 'mcfunction:objective_criteria',
			range: core.Range.get(range),
		}
	}
}

export interface ParticleNode extends core.AstNode {
	type: 'mcfunction:particle',
	children?: (core.FloatNode | core.IntegerNode | core.ResourceLocationNode | BlockNode | ItemNode | VectorNode)[],
	id: core.ResourceLocationNode,
}
export namespace ParticleNode {
	const SpecialTypes = new Set([
		'block',
		'block_marker',
		'dust',
		'dust_color_transition',
		'falling_dust',
		'item',
		'sculk_charge',
		'vibration',
	] as const)
	export type SpecialType = typeof SpecialTypes extends Set<infer T> ? T : undefined
	export function isSpecialType(type: string | undefined): type is SpecialType {
		return SpecialTypes.has(type as SpecialType)
	}

	export function mock(range: core.RangeLike): ParticleNode {
		const id = core.ResourceLocationNode.mock(range, { category: 'particle_type' })
		return {
			type: 'mcfunction:particle',
			range: core.Range.get(range),
			children: [id],
			id,
		}
	}
}

export interface ScoreHolderNode extends core.AstNode {
	type: 'mcfunction:score_holder',
	children: (core.SymbolNode | EntitySelectorNode)[],
	fakeName?: core.SymbolNode,
	selector?: EntitySelectorNode,
}

export interface TimeNode extends core.AstNode {
	type: 'mcfunction:time',
	children: (core.FloatNode | core.LiteralNode)[],
	value: number,
	unit?: string,
}
export namespace TimeNode {
	export const UnitToTicks = new Map<string, number>([
		['', 1],
		['t', 1],
		['s', 20],
		['d', 24000],
	])
	export const Units = [...UnitToTicks.keys()]
}

export interface UuidNode extends core.AstNode {
	type: 'mcfunction:uuid',
	bits: [bigint, bigint],
}

export interface VectorNode extends core.SequenceNode<CoordinateNode> {
	type: 'mcfunction:vector',
	options: VectorNode.Options,
	system: CoordinateSystem,
}
export namespace VectorNode {
	export interface Options {
		dimension: 2 | 3,
		integersOnly?: boolean,
		noLocal?: boolean,
	}

	export function mock(range: core.RangeLike, options: Options): VectorNode {
		return {
			type: 'mcfunction:vector',
			range: core.Range.get(range),
			children: [],
			options,
			system: CoordinateSystem.World,
		}
	}
}
