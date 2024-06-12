import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import {
	NbtByteNode,
	type NbtCompoundNode,
	NbtIntNode,
	type NbtNode,
	type NbtPathNode,
	NbtStringNode,
} from '../node/index.js'
import { getBlocksFromItem, getEntityFromItem } from './mcdocUtil.js'

interface Options {
	allowUnknownKey?: boolean
	isPredicate?: boolean
}

interface PathOptions {
	allowUnknownKey?: boolean
}

/**
 * @param id If the registry is under the `custom` namespace, `id` can only be a string. Otherwise it can be a string, string array, or `undefined`.
 * If set to `undefined` or an empty array, all mcdoc compound definitions for this registry will be merged for checking, and unknown keys are allowed.
 */
export function index(
	registry: string,
	id:
		| core.FullResourceLocation
		| readonly core.FullResourceLocation[]
		| undefined,
	options?: Options,
): core.SyncChecker<NbtCompoundNode>
export function index(
	registry: string,
	id: core.FullResourceLocation,
	options?: Options,
): core.SyncChecker<NbtCompoundNode>
export function index(
	registry: string,
	id:
		| core.FullResourceLocation
		| readonly core.FullResourceLocation[]
		| undefined,
	options: Options = {},
): core.SyncChecker<NbtCompoundNode> {
	switch (registry) {
		case 'custom:blockitemstates':
			const blockIds = getBlocksFromItem(id as core.FullResourceLocation)
			return blockIds ? blockStates(blockIds, options) : core.checker.noop
		case 'custom:blockstates':
			return blockStates([id as string], options)
		case 'custom:spawnitemtag':
			const entityId = getEntityFromItem(id as core.FullResourceLocation)
			return entityId
				? index('entity_type', entityId, options)
				: core.checker.noop
		default:
			const identifier = getRegistryIdentifier(registry)
			if (!identifier) {
				return core.checker.noop
			}
			return (node, ctx) => {
				definition(identifier, options)(node, ctx)
			}
	}
}

function getRegistryIdentifier(registry: string) {
	switch (registry) {
		case 'block':
			return '::java::server::world::block::BlockEntity'
		case 'entity_type':
			return '::java::server::world::entity::AnyEntity'
		case 'item':
			return '::java::server::world::item::AnyItem'
		default:
			return undefined
	}
}

/**
 * @param identifier An identifier of mcdoc compound definition. e.g. `::minecraft::util::invitem::InventoryItem`
 */
export function definition(
	identifier: `::${string}::${string}`,
	options: Options = {},
): core.SyncChecker<NbtNode> {
	return (node, ctx) => {
		mcdoc.runtime.checker.reference<NbtNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			identifier,
			{
				context: ctx,
				isEquivalent: (inferred, def) => {
					switch (inferred.kind) {
						case 'list':
							return [
								'list',
								'tuple',
							].includes(def.kind)
						case 'struct':
							return def.kind === 'struct'
						case 'byte':
						case 'short':
						case 'int':
						case 'long':
							return ['byte', 'short', 'int', 'long', 'float', 'double']
								.includes(def.kind)
						case 'float':
						case 'double':
							return ['float', 'double'].includes(def.kind)
						default:
							return false
					}
				},
				getChildren: node => {
					const { type } = node
					if (
						type === 'nbt:list' || type === 'nbt:byte_array' ||
						type === 'nbt:int_array' || type === 'nbt:long_array'
					) {
						return node.children.filter(n => n.value)
							.map(
								n => [{
									originalNode: n.value!,
									inferredType: inferType(n.value!),
								}],
							)
					}
					if (type === 'nbt:compound') {
						return node.children.filter(kvp => kvp.key).map(kvp => ({
							key: {
								originalNode: kvp.key!,
								inferredType: inferType(kvp.key!),
							},
							possibleValues: kvp.value
								? [{
									originalNode: kvp.value,
									inferredType: inferType(kvp.value),
								}]
								: [],
						}))
					}
					return []
				},
				reportError: mcdoc.runtime.checker.getDefaultErrorReporter(
					ctx,
					mcdoc.runtime.checker.getErrorRangeDefault<NbtNode>,
				),
				attachTypeInfo: (node, definition) => {
					node.typeDef = definition
					// TODO: improve hover info
					if (
						core.PairNode.is(node.parent) &&
						core.StringNode.is(node.parent.key)
					) {
						node.parent.key.hover =
							`\`\`\`typescript\n${node.parent.key.value}: ${
								mcdoc.McdocType.toString(definition)
							}\n\`\`\``
					}
				},
				// TODO json / JE specific attribute handlers
			},
		)
	}
}

function inferType(node: NbtNode): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	switch (node.type) {
		case 'nbt:byte':
			return {
				kind: 'literal',
				value: { kind: 'byte', value: node.value },
			}
		case 'nbt:double':
			return {
				kind: 'literal',
				value: { kind: 'double', value: node.value },
			}
		case 'nbt:float':
			return {
				kind: 'literal',
				value: { kind: 'float', value: node.value },
			}
		case 'nbt:long':
			return {
				kind: 'literal',
				// TODO: this should NOT change type from `bigint` to `number`
				value: { kind: 'long', value: Number(node.value) },
			}
		case 'nbt:int':
			return {
				kind: 'literal',
				value: { kind: 'int', value: node.value },
			}
		case 'nbt:short':
			return {
				kind: 'literal',
				value: { kind: 'short', value: node.value },
			}
		case 'nbt:string':
			return {
				kind: 'literal',
				value: { kind: 'string', value: node.value },
			}
		case 'nbt:list':
			return { kind: 'list', item: { kind: 'any' } }
		case 'nbt:compound':
			return { kind: 'struct', fields: [] }
		case 'nbt:byte_array':
			return { kind: 'byte_array' }
		case 'nbt:long_array':
			return { kind: 'long_array' }
		case 'nbt:int_array':
			return { kind: 'int_array' }
		default:
			return { kind: 'any' }
	}
}

export function blockStates(
	blocks: string[],
	_options: Options = {},
): core.SyncChecker<NbtCompoundNode> {
	return (node, ctx) => {
		const states = core.getStates('block', blocks, ctx)
		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			// Type check.
			if (
				NbtByteNode.is(valueNode) &&
				(ctx.src.slice(valueNode.range).toLowerCase() === 'false' ||
					ctx.src.slice(valueNode.range).toLowerCase() === 'true')
			) {
				ctx.err.report(
					localize('nbt.checker.block-states.fake-boolean'),
					valueNode,
					core.ErrorSeverity.Warning,
				)
				continue
			} else if (!NbtStringNode.is(valueNode) && !NbtIntNode.is(valueNode)) {
				ctx.err.report(
					localize('nbt.checker.block-states.unexpected-value-type'),
					valueNode,
					core.ErrorSeverity.Warning,
				)
				continue
			}

			if (Object.keys(states).includes(keyNode.value)) {
				// The current state exists. Check the value.
				const stateValues = states[keyNode.value]!
				if (!stateValues.includes(valueNode.value.toString())) {
					ctx.err.report(
						localize(
							'expected-got',
							stateValues,
							localeQuote(valueNode.value.toString()),
						),
						valueNode,
						core.ErrorSeverity.Warning,
					)
				}
			} else {
				// The current state doesn't exist.
				ctx.err.report(
					localize(
						'nbt.checker.block-states.unknown-state',
						localeQuote(keyNode.value),
						blocks,
					),
					keyNode,
					core.ErrorSeverity.Warning,
				)
			}
		}
	}
}

/**
 * @param id If set to `undefined` or an empty array, all mcdoc compound definitions for this registry will be merged for checking, and unknown keys are allowed.
 */
export function path(
	registry: string,
	id:
		| core.FullResourceLocation
		| readonly core.FullResourceLocation[]
		| undefined,
	options?: PathOptions,
): core.SyncChecker<NbtPathNode> {
	return (node, ctx) => {
		// TODO
	}
}
