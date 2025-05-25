import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { NbtPathChild, NbtPathNode, TypedNbtNode } from '../node/index.js'
import {
	NbtCompoundNode,
	NbtNode,
	NbtPathFilterNode,
	NbtPathIndexNode,
	NbtPathKeyNode,
	NbtPrimitiveNode,
	NbtStringNode,
} from '../node/index.js'
import { getBlocksFromItem, getEntityFromItem } from './mcdocUtil.js'

export const typed: core.SyncChecker<TypedNbtNode> = (node, ctx) => {
	typeDefinition(node.targetType)(node.children[0], ctx)
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<TypedNbtNode>('nbt:typed', typed)
}

interface Options {
	isPredicate?: boolean
	isMerge?: boolean
}

/**
 * @param id If the registry is under the `custom` namespace, `id` can only be a string. Otherwise it can be a string, string array, or `undefined`.
 * If set to `undefined` or an empty array, all mcdoc compound definitions for this registry will be merged for checking, and unknown keys are allowed.
 */
export function index(
	registry: core.FullResourceLocation,
	id?: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined,
	options: Options = {},
): core.SyncChecker<NbtNode> {
	switch (registry) {
		case 'custom:blockitemstates':
			const blockIds = getBlocksFromItem(id as core.FullResourceLocation)
			return blockIds ? blockStates(blockIds, options) : core.checker.noop
		case 'custom:blockstates':
			return blockStates([id as string], options)
		case 'custom:spawnitemtag':
			const entityId = getEntityFromItem(id as core.FullResourceLocation)
			return entityId ? index('minecraft:entity', entityId, options) : core.checker.noop
		default:
			const typeDef: mcdoc.McdocType = {
				kind: 'dispatcher',
				registry,
				parallelIndices: getIndices(id),
			}

			return (node, ctx) => {
				typeDefinition(typeDef, options)(node, ctx)
			}
	}
}

function getIndices(
	id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined,
): mcdoc.ParallelIndices {
	if (typeof id === 'string') {
		return [{ kind: 'static', value: id }]
	} else if (id === undefined || id.length === 0) {
		return [{ kind: 'static', value: '%fallback' }]
	} else {
		return id.map(i => ({ kind: 'static', value: i }))
	}
}

/**
 * @param identifier An identifier of mcdoc compound definition. e.g. `::minecraft::util::invitem::InventoryItem`
 */
export function typeDefinition(
	typeDef: mcdoc.McdocType,
	options: Options = {},
): core.SyncChecker<NbtNode> {
	return (node, ctx) => {
		mcdoc.runtime.checker.typeDefinition<NbtNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			typeDef,
			mcdoc.runtime.checker.McdocCheckerContext.create(ctx, {
				allowMissingKeys: options.isPredicate || options.isMerge,
				requireCanonical: options.isPredicate,
				isEquivalent: (inferred, def) => {
					if (def.kind === 'boolean') {
						// TODO: this should check whether the value is 0 or 1
						return inferred.kind === 'byte'
					}
					if (inferred.kind === 'list') {
						return def.kind === 'list' || def.kind === 'tuple'
					}
					if (options.isPredicate) {
						return inferred.kind === def.kind
					}
					switch (inferred.kind) {
						case 'struct':
							return def.kind === 'struct'
						case 'byte':
						case 'short':
						case 'int':
						case 'long':
							return ['byte', 'short', 'int', 'long', 'float', 'double'].includes(def.kind)
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
						type === 'nbt:list' || type === 'nbt:byte_array'
						|| type === 'nbt:int_array' || type === 'nbt:long_array'
					) {
						return node.children.filter(n => n.value).map(
							n => [{ originalNode: n.value!, inferredType: inferType(n.value!) }],
						)
					}
					if (type === 'nbt:compound') {
						return node.children.filter(kvp => kvp.key).map(kvp => ({
							key: { originalNode: kvp.key!, inferredType: inferType(kvp.key!) },
							possibleValues: kvp.value
								? [{ originalNode: kvp.value, inferredType: inferType(kvp.value) }]
								: [],
						}))
					}
					return []
				},
				reportError: (error) => {
					if (options.isPredicate && error.kind === 'invalid_collection_length') {
						return
					}
					mcdoc.runtime.checker.getDefaultErrorReporter(
						ctx,
						mcdoc.runtime.checker.getDefaultErrorRange<NbtNode>,
					)(error)
				},
				attachTypeInfo: (node, definition, desc = '') => {
					node.typeDef = definition
					node.requireCanonical = options.isPredicate
					// TODO: improve hover info
					if (
						node.parent && core.PairNode?.is(node.parent)
						&& NbtNode.is(node.parent.key)
						&& NbtNode.is(node.parent.value)
					) {
						if (node.parent.key?.typeDef && node.parent.value?.typeDef) {
							const valueString = mcdoc.McdocType.toString(node.parent.value.typeDef)
							let keyString = mcdoc.McdocType.toString(node.parent.key.typeDef)
							if (node.parent.key.typeDef.kind !== 'literal') {
								keyString = `[${keyString}]`
							}

							node.parent.key.hover =
								`\`\`\`typescript\n${keyString}: ${valueString}\n\`\`\`\n${desc}`

							if (NbtPrimitiveNode.is(node.parent.value)) {
								node.parent.value.hover =
									`\`\`\`typescript\n${valueString}\n\`\`\`\n${desc}`
							}
						}
					} else if (NbtPrimitiveNode.is(node)) {
						node.hover = `\`\`\`typescript\n${
							mcdoc.McdocType.toString(definition)
						}\n\`\`\`\n${desc}`
					}
				},
				nodeAttacher: (node, attacher) => attacher(node),
				stringAttacher: (node, attacher) => {
					if (!NbtStringNode.is(node)) {
						return
					}
					attacher(node)
					if (node.children) {
						core.AstNode.setParents(node)
						// Because the runtime checker happens after binding, we need to manually call this
						core.binder.fallbackSync(node, ctx)
						core.checker.fallbackSync(node, ctx)
					}
				},
			}),
		)
	}
}

function inferType(node: NbtNode): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	switch (node.type) {
		case 'nbt:byte':
			return { kind: 'literal', value: { kind: 'byte', value: node.value } }
		case 'nbt:double':
			return { kind: 'literal', value: { kind: 'double', value: node.value } }
		case 'nbt:float':
			return { kind: 'literal', value: { kind: 'float', value: node.value } }
		case 'nbt:long':
			return {
				kind: 'literal',
				// TODO: this should NOT change type from `bigint` to `number`
				value: { kind: 'long', value: Number(node.value) },
			}
		case 'nbt:int':
			return { kind: 'literal', value: { kind: 'int', value: node.value } }
		case 'nbt:short':
			return { kind: 'literal', value: { kind: 'short', value: node.value } }
		case 'nbt:string':
			return { kind: 'literal', value: { kind: 'string', value: node.value } }
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
	}
}

export function blockStates(blocks: string[], _options: Options = {}): core.SyncChecker<NbtNode> {
	return (node, ctx) => {
		if (!NbtCompoundNode.is(node)) {
			return
		}
		const states = core.getStates('block', blocks, ctx)
		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			// Type check.
			if (
				valueNode.type === 'nbt:byte'
				&& (ctx.src.slice(valueNode.range).toLowerCase() === 'false'
					|| ctx.src.slice(valueNode.range).toLowerCase() === 'true')
			) {
				ctx.err.report(
					localize('nbt.checker.block-states.fake-boolean'),
					valueNode,
					core.ErrorSeverity.Warning,
				)
				continue
			} else if (valueNode.type !== 'nbt:string' && valueNode.type !== 'nbt:int') {
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
						localize('expected-got', stateValues, localeQuote(valueNode.value.toString())),
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

interface NbtPathLink {
	path: NbtPathNode
	node: NbtPathChild | { type: 'leaf'; range: core.Range }
	prev?: NbtPathLink
	next?: NbtPathLink
}

// TODO: check nbt index nodes and nbt compound nodes
export function path(
	registry: core.FullResourceLocation,
	id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined,
): core.SyncChecker<NbtPathNode> {
	return (node, ctx) => {
		// TODO: support dispatcher
		const typeDef: mcdoc.McdocType = {
			kind: 'dispatcher',
			registry,
			parallelIndices: getIndices(id),
		}
		// Create a linked list representation
		const leaf = { type: 'leaf', range: core.Range.create(node.range.end) } as const
		let link: NbtPathLink = { path: node, node: leaf }
		for (let i = node.children.length - 1; i >= 0; i -= 1) {
			link = { path: node, node: node.children[i], next: link }
		}
		let prev = link
		while (prev.next) {
			prev.next.prev = prev
			prev = prev.next
		}
		mcdoc.runtime.checker.typeDefinition<NbtPathLink>(
			[{ originalNode: link, inferredType: inferPath(link) }],
			typeDef,
			mcdoc.runtime.checker.McdocCheckerContext.create(ctx, {
				allowMissingKeys: true,
				requireCanonical: true,
				isEquivalent: (inferred, def) => {
					switch (inferred.kind) {
						case 'list':
						case 'byte_array':
						case 'int_array':
						case 'long_array':
							return ['list', 'tuple', 'byte_array', 'int_array', 'long_array'].includes(
								def.kind,
							)
						default:
							return false
					}
				},
				getChildren: (link): mcdoc.runtime.checker.RuntimeUnion<NbtPathLink>[] => {
					while (link.next && link.node.type !== 'leaf' && NbtPathFilterNode.is(link.node)) {
						link = link.next
					}
					if (!link.next || link.node.type === 'leaf') {
						return []
					}
					if (NbtPathIndexNode.is(link.node)) {
						return [[{ originalNode: link.next, inferredType: inferPath(link.next) }]]
					}
					if (NbtPathKeyNode.is(link.node)) {
						return [{
							key: {
								originalNode: link,
								inferredType: {
									kind: 'literal',
									value: { kind: 'string', value: link.node.children[0].value },
								},
							},
							possibleValues: [{
								originalNode: link.next,
								inferredType: inferPath(link.next),
							}],
						}]
					}
					// Never reachable
					return []
				},
				reportError: (error) => {
					if (error.kind === 'invalid_collection_length') {
						return
					}
					mcdoc.runtime.checker.getDefaultErrorReporter<NbtPathLink>(
						ctx,
						({ originalNode: link }) => link.node.range,
					)(error)
				},
				attachTypeInfo: (link, definition, desc = '') => {
					if (definition.kind === 'literal' && !definition.attributes?.length) {
						return
					}
					if (link.node.type === 'leaf') {
						link.path.endTypeDef = definition
					} else {
						link.node.typeDef = definition
					}
					// TODO: improve hover info
					if (NbtPathKeyNode.is(link.prev?.node)) {
						link.prev.node.hover = `\`\`\`typescript\n${link.prev.node.children[0].value}: ${
							mcdoc.McdocType.toString(definition)
						}\n\`\`\`\n${desc}`
					}
				},
				nodeAttacher: (link, attacher) => {
					if (link.node.type !== 'leaf') {
						attacher(link.node)
					}
				},
				stringAttacher: (link, attacher) => {
					if (!NbtPathKeyNode.is(link.node)) {
						return
					}
					attacher(link.node.children[0])
					if (link.node.children[0].children) {
						core.AstNode.setParents(link.node.children[0])
						// Because the runtime checker happens after binding, we need to manually call this
						core.binder.fallbackSync(link.node.children[0], ctx)
						core.checker.fallbackSync(link.node.children[0], ctx)
					}
				},
			}),
		)
	}
}

function inferPath(link: NbtPathLink): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	if (link.node.type === 'leaf') {
		return { kind: 'unsafe' }
	}
	if (NbtPathIndexNode.is(link.node)) {
		return { kind: 'list', item: { kind: 'any' } }
	}
	return { kind: 'struct', fields: [] }
}
