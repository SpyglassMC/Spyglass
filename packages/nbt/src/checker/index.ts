import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import type {
	RuntimeNode,
	RuntimePair,
	RuntimeUnion,
	SimplifiedMcdocType,
	SimplifiedMcdocTypeNoUnion,
} from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { NbtPathChild, NbtPathNode, TypedNbtNode } from '../node/index.js'
import {
	NbtByteNode,
	NbtCollectionNode,
	NbtCompoundNode,
	NbtIntegerAlikeNode,
	NbtListNode,
	NbtNode,
	NbtNumberNode,
	NbtPathFilterNode,
	NbtPathIndexNode,
	NbtPathKeyNode,
	NbtPrimitiveNode,
	NbtStringNode,
	NbtUuidFunctionNode,
} from '../node/index.js'
import { localizeTag } from '../util.js'
import { getBlocksFromItem, getEntityFromItem } from './mcdocUtil.js'

/**
 * Runs `typeDefinition` on the typed wrapper's inner NbtNode.
 */
export function typed(
	node: TypedNbtNode,
	ctx: core.CheckerContext,
): void {
	typeDefinition(node.targetType)(node.children[0], ctx)
}

/**
 * Reports list elements whose type differs from the type of the first element.
 *
 * Not registered by {@link register}: whether lists have to be homogeneous
 * depends on the game version, which only the edition package knows. Edition
 * packages register this checker for `nbt:list` when it applies.
 */
export const listTypeHomogeneous: core.SyncChecker<NbtListNode> = (node, ctx) => {
	if (!node.valueType) {
		return
	}
	for (const { value } of node.children) {
		if (value && value.type !== node.valueType) {
			ctx.err.report(
				localize('expected-got', localizeTag(node.valueType), localizeTag(value.type)),
				value,
			)
		}
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<TypedNbtNode>('nbt:typed', typed)
}

export interface Options {
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
		// Run any per-NbtNode-type checkers (e.g. the java-edition
		// SNBT-syntax check) before mcdoc/runtime descends so that
		// version-aware syntax diagnostics land alongside the type
		// errors instead of after them.
		core.checker.fallbackSync(node, ctx)
		mcdoc.runtime.checker.typeDefinition<NbtNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			typeDef,
			mcdoc.runtime.checker.McdocCheckerContext.create(ctx, {
				allowMissingKeys: options.isPredicate || options.isMerge,
				requireCanonical: options.isPredicate,
				tryConvertTo: (node, target) => {
					if (target.kind === 'boolean' && NbtByteNode.is(node)) {
						if (node.value === 0) {
							return { kind: 'literal', value: { kind: 'boolean', value: false } }
						} else if (node.value === 1) {
							return { kind: 'literal', value: { kind: 'boolean', value: true } }
						}
					}
					if (target.kind === 'tuple' && NbtListNode.is(node)) {
						return {
							kind: 'tuple',
							items: [],
						}
					}
					if (!options.isPredicate) {
						if (NbtNumberNode.is(node)) {
							const literalValue = mcdoc.LiteralNumericValue.makeIfValid(
								target.kind,
								node.value,
								NbtIntegerAlikeNode.is(node),
								true,
							)
							if (literalValue !== undefined) {
								return { kind: 'literal', value: literalValue }
							}
						}
						if (NbtCollectionNode.is(node)) {
							switch (target.kind) {
								case 'list':
									return { kind: 'list', item: { kind: 'any' } }
								case 'byte_array':
								case 'int_array':
								case 'long_array':
									return { kind: target.kind }
								case 'tuple':
									return { kind: 'tuple', items: [] }
							}
						}
					}
					return undefined
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
					if (type === 'nbt:uuid_function') {
						return node.intArray.children.filter(n => n.value).map(
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
					attachNbtTypeInfo(node, definition, desc, options.isPredicate)
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

function attachNbtTypeInfo(
	node: NbtNode,
	definition: SimplifiedMcdocType,
	desc: string,
	requireCanonical: boolean | undefined,
) {
	node.typeDef = definition
	node.requireCanonical = requireCanonical
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

			node.parent.key.hover = `\`\`\`typescript\n${keyString}: ${valueString}\n\`\`\`\n${desc}`

			if (NbtPrimitiveNode.is(node.parent.value)) {
				let valueHover = `\`\`\`typescript\n${valueString}\n\`\`\`\n${desc}`
				// Preserve any hover set by the parser (e.g. the decimal
				// value of a hex/binary literal) so it shows up alongside
				// the mcdoc type info instead of being clobbered.
				if (node.parent.value.hover) {
					valueHover += `\n\n${node.parent.value.hover}`
				}
				node.parent.value.hover = valueHover
			}
		}
	} else if (NbtPrimitiveNode.is(node)) {
		let hover = `\`\`\`typescript\n${mcdoc.McdocType.toString(definition)}\n\`\`\`\n${desc}`
		// Preserve any hover set by the parser (e.g. the decimal
		// value of a hex/binary literal) so it shows up alongside
		// the mcdoc type info instead of being clobbered.
		if (node.hover) {
			hover += `\n\n${node.hover}`
		}
		node.hover = hover
	} else if (NbtUuidFunctionNode.is(node)) {
		const uuidNode = node
		// Skip the hover when the UUID is invalid - the parser
		// already reports the error on the string arg, and a
		// hover here would be redundant noise.
		if (uuidNode.value.length !== 4) {
			return
		}
		uuidNode.hover = `\`\`\`mcdoc\n[I; ${uuidNode.value.join(', ')}]\n\`\`\``
	}
}

function inferType(node: NbtNode): SimplifiedMcdocTypeNoUnion {
	switch (node.type) {
		case 'nbt:byte':
			return { kind: 'literal', value: { kind: 'byte', value: node.value } }
		case 'nbt:double':
			return { kind: 'literal', value: { kind: 'double', value: node.value } }
		case 'nbt:float':
			return { kind: 'literal', value: { kind: 'float', value: node.value } }
		case 'nbt:long':
			return { kind: 'literal', value: { kind: 'long', value: node.value } }
		case 'nbt:int':
			return { kind: 'literal', value: { kind: 'int', value: node.value } }
		case 'nbt:short':
			return { kind: 'literal', value: { kind: 'short', value: node.value } }
		case 'nbt:string':
			return { kind: 'literal', value: { kind: 'string', value: node.value } }
		case 'nbt:bool_function':
			return { kind: 'literal', value: { kind: 'boolean', value: node.value } }
		case 'nbt:uuid_function':
			// A `uuid(...)` call is semantically a 4-long int array. The
			// runtime checker sees it as a ghost `int_array` so fields typed
			// as `int[]` (or `int_array`) accept it without complaint.
			return { kind: 'int_array', lengthRange: { kind: 0b00, min: 4, max: 4 } }
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

/**A partial NBT value described by NBT path and its filters.*/
interface NbtPathRuntimeData {
	source: core.AstNode
	type: SimplifiedMcdocTypeNoUnion
	children: RuntimeUnion<NbtPathRuntimeData>[]
	/** Original NBT nodes represented*/
	nodes: NbtNode[]
	pathTargets: (NbtPathChild | { type: 'leaf'; range: core.Range })[]
	hoverKeys: NbtPathKeyNode[]
}

function NbtPathRuntimeNode(
	data: NbtPathRuntimeData,
): RuntimeNode<NbtPathRuntimeData> {
	return { originalNode: data, inferredType: data.type }
}

export function path(
	registry: core.FullResourceLocation,
	id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined,
): core.SyncChecker<NbtPathNode> {
	function makeNew(source: core.AstNode, type: SimplifiedMcdocTypeNoUnion): NbtPathRuntimeData {
		return { source, type, children: [], nodes: [], pathTargets: [], hoverKeys: [] }
	}
	function keyOf(child: RuntimeUnion<NbtPathRuntimeData>): string | undefined {
		if (
			!Array.isArray(child) && child.key.inferredType.kind === 'literal'
			&& child.key.inferredType.value.kind === 'string'
		) {
			return child.key.inferredType.value.value
		}
		return undefined
	}
	/** Convert an NBT into a {@link NbtPathRuntimeData} */
	function fromNbt(node: NbtNode): NbtPathRuntimeData {
		const runtimData: NbtPathRuntimeData = makeNew(node, inferType(node))
		runtimData.nodes.push(node)
		if (NbtCompoundNode.is(node)) {
			runtimData.children = node.children.filter(pair => pair.key).map(pair => {
				return {
					key: NbtPathRuntimeNode(fromNbt(pair.key!)),
					possibleValues: pair.value ? [NbtPathRuntimeNode(fromNbt(pair.value))] : [],
				}
			})
		} else if (NbtCollectionNode.is(node)) {
			runtimData.children = node.children.filter(entry => entry.value).map(entry => [
				NbtPathRuntimeNode(fromNbt(entry.value!)),
			])
		}
		return runtimData
	}

	// Infer the type of an element in the Path,
	// or check if the element matches the expected type.
	function inferOrCheckType(
		data: NbtPathRuntimeData,
		requiredType: SimplifiedMcdocTypeNoUnion,
		source: core.AstNode,
		ctx: core.CheckerContext,
	): void {
		if (data.type.kind === 'unsafe') {
			Object.assign(data.type, requiredType)
			data.source = source
		} else if (data.type.kind !== requiredType.kind) {
			ctx.err.report(
				localize(
					'expected-got',
					mcdoc.McdocType.toString(data.type),
					mcdoc.McdocType.toString(requiredType),
				),
				source,
			)
		}
	}
	function addPathKey(
		data: NbtPathRuntimeData,
		key: NbtPathKeyNode,
		ctx: core.CheckerContext,
	): NbtPathRuntimeData[] {
		inferOrCheckType(data, { kind: 'struct', fields: [] }, key, ctx)
		data.pathTargets.push(key)
		const matches = data.children.filter((child): child is RuntimePair<NbtPathRuntimeData> =>
			!Array.isArray(child) && keyOf(child) === key.children[0].value
		)
		if (!matches.length) {
			const member = { key: NbtPathRuntimeNode(fromNbt(key.children[0])), possibleValues: [] }
			data.children.push(member)
			matches.push(member)
		}
		return matches.flatMap(member => {
			if (!member.key.originalNode.nodes.includes(key.children[0])) {
				member.key.originalNode.nodes.push(key.children[0])
			}
			if (!member.possibleValues.length) {
				member.possibleValues.push(NbtPathRuntimeNode(makeNew(key, { kind: 'unsafe' })))
			}
			return member.possibleValues.map(value => {
				value.originalNode.hoverKeys.push(key)
				return value.originalNode
			})
		})
	}
	function addFilter(
		data: NbtPathRuntimeData,
		filterNode: NbtCompoundNode,
		ctx: core.CheckerContext,
	): void {
		inferOrCheckType(data, { kind: 'struct', fields: [] }, filterNode, ctx)
		data.children.push(...fromNbt(filterNode).children)
		data.nodes.push(filterNode)
	}
	function pathToTree(path: NbtPathNode, ctx: core.CheckerContext): NbtPathRuntimeData {
		const root = makeNew(path, { kind: 'unsafe' })
		let current = [root]
		for (const part of path.children) {
			if (NbtPathKeyNode.is(part)) {
				current = current.flatMap(data => addPathKey(data, part, ctx))
				continue
			}
			if (NbtPathFilterNode.is(part)) {
				core.checker.fallbackSync(part.children[0], ctx)
				for (const data of current) {
					addFilter(data, part.children[0], ctx)
					data.pathTargets.push(part)
				}
				continue
			}
			const filter = part.children?.[0]
			if (NbtCompoundNode.is(filter)) {
				core.checker.fallbackSync(filter, ctx)
			}
			current = current.map(data => {
				inferOrCheckType(data, { kind: 'list', item: { kind: 'any' } }, part, ctx)
				data.pathTargets.push(part)
				const element = makeNew(part, { kind: 'unsafe' })
				if (NbtCompoundNode.is(filter)) {
					addFilter(element, filter, ctx)
				}
				data.children.push([NbtPathRuntimeNode(element)])
				return element
			})
		}
		const leaf = { type: 'leaf', range: core.Range.create(path.range.end) } as const
		for (const data of current) {
			data.pathTargets.push(leaf)
		}
		return root
	}
	function createContext(path: NbtPathNode, ctx: core.CheckerContext) {
		return mcdoc.runtime.checker.McdocCheckerContext.create<NbtPathRuntimeData>(ctx, {
			allowMissingKeys: true,
			requireCanonical: true,
			getChildren: runtimeData => runtimeData.children,
			tryConvertTo: (runTimeData, target) => {
				const node = runTimeData.nodes[0]
				if (
					target.kind === 'boolean' && NbtByteNode.is(node)
					&& (node.value === 0 || node.value === 1)
				) {
					return { kind: 'literal', value: { kind: 'boolean', value: node.value === 1 } }
				}
				if (
					runTimeData.type.kind === 'list' && (target.kind === 'tuple'
						|| runTimeData.pathTargets.some(NbtPathIndexNode.is))
				) {
					switch (target.kind) {
						case 'tuple':
							return { kind: 'tuple', items: [] }
						case 'byte_array':
							return { kind: 'byte_array' }
						case 'int_array':
							return { kind: 'int_array' }
						case 'long_array':
							return { kind: 'long_array' }
					}
				}
				return undefined
			},
			reportError: error => {
				if (error.kind !== 'invalid_collection_length') {
					mcdoc.runtime.checker.getDefaultErrorReporter<NbtPathRuntimeData>(
						ctx,
						({ originalNode }) => originalNode.source.range,
					)(error)
				}
			},
			attachTypeInfo: (runtimeData, definition, desc = '', originalDefinition) => {
				for (const node of runtimeData.nodes) {
					attachNbtTypeInfo(node, definition, desc, true)
				}
				for (const node of runtimeData.pathTargets) {
					if (node.type === 'leaf') {
						path.endOriginalTypeDef = originalDefinition
						path.endTypeDef = definition
					} else {
						node.typeDef = definition
					}
				}
				for (const key of runtimeData.hoverKeys) {
					key.hover = `\`\`\`typescript\n${key.children[0].value}: ${
						mcdoc.McdocType.toString(definition)
					}\n\`\`\`\n${desc}`
				}
			},
			nodeAttacher: (runtimeData, attacher) => {
				for (const node of [...runtimeData.nodes, ...runtimeData.pathTargets]) {
					if (node.type !== 'leaf') {
						attacher(node)
					}
				}
			},
			stringAttacher: (runtimeData, attacher) => {
				for (const node of runtimeData.nodes.filter(NbtStringNode.is)) {
					attacher(node)
					if (node.children) {
						core.AstNode.setParents(node)
						core.binder.fallbackSync(node, ctx)
						core.checker.fallbackSync(node, ctx)
					}
				}
			},
		})
	}

	return (path, ctx) => {
		const root = pathToTree(path, ctx)
		mcdoc.runtime.checker.typeDefinition(
			[NbtPathRuntimeNode(root)],
			{ kind: 'dispatcher', registry, parallelIndices: getIndices(id) },
			createContext(path, ctx),
		)
	}
}
