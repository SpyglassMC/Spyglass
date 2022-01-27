import type * as core from '@spyglassmc/core'
import type * as nbt from '@spyglassmc/nbt'

export interface BlockStatesNode extends core.TableNode<core.StringNode, core.StringNode> {
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

export const CoordinateNotations = ['', '~', '^'] as const
export type CoordinateNodeNotation = typeof CoordinateNotations[number]

export interface CoordinateNode extends core.FloatBaseNode {
	type: 'mcfunction:coordinate',
	notation: CoordinateNodeNotation,
}
export namespace CoordinateNode {
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

export interface EntitySelectorAdvancementsArgumentCriteriaNode extends core.TableNode<core.StringNode, core.BooleanNode> {
	type: 'mcfunction:entity_selector/arguments/advancements/criteria'
}
export interface EntitySelectorAdvancementsArgumentNode extends core.TableNode<core.ResourceLocationNode, core.BooleanNode | EntitySelectorAdvancementsArgumentCriteriaNode> {
	type: 'mcfunction:entity_selector/arguments/advancements'
}
export interface EntitySelectorScoresArgumentNode extends core.TableNode<core.SymbolNode, IntRangeNode> {
	type: 'mcfunction:entity_selector/arguments/scores'
}
export interface EntitySelectorInvertableArgumentValueNode<T extends core.AstNode> extends core.SequenceNode<core.LiteralNode | T> {
	type: 'mcfunction:entity_selector/arguments/value/invertable',
	value: T,
	inverted: boolean,
}
export interface EntitySelectorArgumentsNode extends core.TableNode<core.StringNode, any> {
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

export interface ItemNode extends core.AstNode {
	type: 'mcfunction:item',
	children: (core.ResourceLocationNode | nbt.NbtCompoundNode)[],
	id: core.ResourceLocationNode,
	nbt?: nbt.NbtCompoundNode,
}

export interface VectorNode extends core.SequenceNode<CoordinateNode> {
	type: 'mcfunction:vector',
	dimension: 2 | 3,
	system: CoordinateSystem,
}

export interface FloatRangeNode extends core.AstNode {
	type: 'mcfunction:float_range',
	children: (core.FloatNode | core.LiteralNode)[],
	value: [number | undefined, number | undefined],
}
export interface IntRangeNode extends core.AstNode {
	type: 'mcfunction:int_range',
	children: (core.IntegerNode | core.LiteralNode)[],
	value: [number | undefined, number | undefined],
}
export interface MessageNode extends core.AstNode {
	type: 'mcfunction:argument/minecraft:message',
	children: (core.StringNode | EntitySelectorNode)[],
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
