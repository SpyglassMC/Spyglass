import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { NbtCompoundNode, NbtPathNode } from '../node/index.js'
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
): core.SyncChecker<NbtCompoundNode> {
	return (node, ctx) => {
		const symbol = ctx.symbols.query(ctx.doc, 'mcdoc', identifier)
		const typeDef = symbol.getData(mcdoc.binder.TypeDefSymbolData.is)?.typeDef
		if (!typeDef) {
			return
		}
		switch (typeDef.kind) {
			case 'struct':
				// TODO
				break
			default:
				ctx.logger.error(
					`[nbt.checker.definition] Expected a struct type, but got ${typeDef.kind}`,
				)
		}
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
				valueNode.type === 'nbt:byte' &&
				(ctx.src.slice(valueNode.range).toLowerCase() === 'false' ||
					ctx.src.slice(valueNode.range).toLowerCase() === 'true')
			) {
				ctx.err.report(
					localize('nbt.checker.block-states.fake-boolean'),
					valueNode,
					core.ErrorSeverity.Warning,
				)
				continue
			} else if (
				valueNode.type !== 'string' && valueNode.type !== 'nbt:int'
			) {
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
