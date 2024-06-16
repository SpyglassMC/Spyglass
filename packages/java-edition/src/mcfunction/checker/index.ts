import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localize } from '@spyglassmc/locales'
import type * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import * as nbt from '@spyglassmc/nbt'
import { getTagValues } from '../../common/index.js'
import type {
	EntitySelectorInvertableArgumentValueNode,
} from '../node/index.js'
import {
	BlockNode,
	ComponentTestExactNode,
	ComponentTestSubpredicateNode,
	EntityNode,
	ItemPredicateNode,
	ItemStackNode,
	JsonNode,
	NbtNode,
	NbtResourceNode,
	ParticleNode,
} from '../node/index.js'

export const command: core.Checker<mcf.CommandNode> = (node, ctx) => {
	if (node.slash && node.parent && mcf.McfunctionNode.is(node.parent)) {
		ctx.err.report(localize('unexpected-leading-slash'), node.slash)
	}
	rootCommand(node.children, 0, ctx)
}

const getNode = (
	nodes: mcf.CommandNode['children'],
	name: string,
): core.AstNode | undefined => {
	return nodes.find(n => n.path[n.path.length - 1] === name)?.children[0]
}

const rootCommand = (
	nodes: mcf.CommandNode['children'],
	index: number,
	ctx: core.CheckerContext,
) => {
	for (const { children: [node] } of nodes) {
		if (BlockNode.is(node)) {
			block(node, ctx)
		} else if (EntityNode.is(node)) {
			entity(node, ctx)
		} else if (ItemPredicateNode.is(node)) {
			itemPredicate(node, ctx)
		} else if (ItemStackNode.is(node)) {
			itemStack(node, ctx)
		} else if (ParticleNode.is(node)) {
			particle(node, ctx)
		} else if (JsonNode.is(node)) {
			jsonChecker(node, ctx)
		} else if (NbtResourceNode.is(node)) {
			nbtResource(node, ctx)
		} else if (NbtNode.is(node) && node.properties) {
			const by = getNode(nodes, node.properties.dispatchedBy)
			// TODO: support `indexedBy`, `isPredicate`, and `accessType`
			nbtChecker(by)(node, ctx)
		}
	}
}

// #region Checkers for argument nodes
const block: core.SyncChecker<BlockNode> = (node, ctx) => {
	if (!node.nbt) {
		return
	}

	nbt.checker.index(
		'minecraft:block_entity',
		core.ResourceLocationNode.toString(node.id, 'full'),
	)(node.nbt, ctx)
}

const entity: core.SyncChecker<EntityNode> = (node, ctx) => {
	for (const pair of node.selector?.arguments?.children ?? []) {
		if (pair.key?.value !== 'nbt' || !pair.value) {
			return
		}
		const types = getTypesFromEntity(node, ctx)
		if (!nbt.NbtCompoundNode.is(pair.value.value)) {
			return
		}
		nbt.checker.index('minecraft:entity', types)(pair.value.value, ctx)
	}
}

const itemPredicate: core.SyncChecker<ItemPredicateNode> = (node, ctx) => {
	if (node.nbt) {
		nbt.checker.index(
			'minecraft:item',
			core.ResourceLocationNode.toString(node.id, 'full'),
			{ isPredicate: true },
		)(node.nbt, ctx)
	}
	if (!node.tests) {
		return
	}
	for (const anyOfTest of node.tests.children) {
		for (const allOfTest of anyOfTest.children) {
			for (const test of allOfTest.children) {
				const key = core.ResourceLocationNode.toString(test.key, 'full')
				if (ComponentTestExactNode.is(test) && test.value) {
					nbt.checker.index('minecraft:data_component', key)(
						test.value,
						ctx,
					)
				} else if (ComponentTestSubpredicateNode.is(test) && test.value) {
					nbt.checker.index('minecraft:item_sub_predicate', key)(
						test.value,
						ctx,
					)
				}
			}
		}
	}
}

const itemStack: core.SyncChecker<ItemStackNode> = (node, ctx) => {
	if (node.nbt) {
		const id = core.ResourceLocationNode.toString(node.id, 'full')
		nbt.checker.index('minecraft:item', id)(node.nbt, ctx)
	}
	if (!node.components) {
		return
	}
	const groupedComponents = new Map<string, core.AstNode[]>()
	for (const pair of node.components.children) {
		if (!pair.key) {
			continue
		}
		const key = core.ResourceLocationNode.toString(pair.key, 'full')
		if (!groupedComponents.has(key)) {
			groupedComponents.set(key, [])
		}
		groupedComponents.get(key)!.push(pair.key)
		if (pair.value) {
			nbt.checker.index('minecraft:data_component', key)(pair.value, ctx)
		}
	}
	for (const [_, group] of groupedComponents) {
		if (group.length > 1) {
			for (const node of group) {
				ctx.err.report(
					localize('mcfunction.parser.duplicate-components'),
					node.range,
					core.ErrorSeverity.Warning,
				)
			}
		}
	}
}

const jsonChecker: core.SyncChecker<JsonNode> = (node, ctx) => {
	const type: mcdoc.McdocType = { kind: 'reference', path: node.typeRef }
	json.checker.index(type)(node.children[0], ctx)
}

const nbtResource: core.SyncChecker<NbtResourceNode> = (node, ctx) => {
	const type: mcdoc.McdocType = {
		kind: 'dispatcher',
		registry: 'minecraft:resource',
		parallelIndices: [{
			kind: 'static',
			value: core.ResourceLocation.lengthen(node.category),
		}],
	}
	nbt.checker.typeDefinition(type)(node.children[0], ctx)
}

function nbtChecker(dispatchedBy?: core.AstNode): core.SyncChecker<NbtNode> {
	return (node, ctx) => {
		if (!node.properties) {
			return
		}
		const compound = node.children[0]
		switch (node.properties.dispatcher) {
			case 'minecraft:entity':
				if (nbt.NbtCompoundNode.is(compound)) {
					const types = (EntityNode.is(dispatchedBy) ||
							core.ResourceLocationNode.is(dispatchedBy))
						? getTypesFromEntity(dispatchedBy, ctx)
						: undefined
					nbt.checker.index('minecraft:entity', types, {
						isPredicate: node.properties.isPredicate,
					})(compound, ctx)
				}
				break
			case 'minecraft:block_entity':
				if (nbt.NbtCompoundNode.is(compound)) {
					nbt.checker.index('minecraft:block_entity')(compound, ctx)
				}
				break
			case 'minecraft:storage':
				if (nbt.NbtCompoundNode.is(compound)) {
					nbt.checker.index('minecraft:storage')(compound, ctx)
				}
				break
		}
	}
}

const particle: core.SyncChecker<ParticleNode> = (node, ctx) => {
	core.checker.dispatchSync(node, ctx)
}
// #endregion

function getTypesFromEntity(
	entity: EntityNode | core.ResourceLocationNode,
	ctx: core.CheckerContext,
): core.FullResourceLocation[] | undefined {
	if (core.ResourceLocationNode.is(entity)) {
		const value = core.ResourceLocationNode.toString(
			entity,
			'full',
			true,
		)
		if (value.startsWith(core.ResourceLocation.TagPrefix)) {
			return getTagValues(
				'tag/entity_type',
				value.slice(1),
				ctx,
			) as core.FullResourceLocation[]
		} else {
			return [value as core.FullResourceLocation]
		}
	} else if (entity.playerName !== undefined || entity.selector?.playersOnly) {
		return ['minecraft:player']
	} else if (entity.selector) {
		const argumentsNode = entity.selector.arguments
		if (!argumentsNode) {
			return undefined
		}
		let types: core.FullResourceLocation[] | undefined = undefined
		for (const pairNode of argumentsNode.children) {
			if (pairNode.key?.value !== 'type') {
				continue
			}
			const valueNode = pairNode.value as
				| EntitySelectorInvertableArgumentValueNode<
					core.ResourceLocationNode
				>
				| undefined
			if (!valueNode || valueNode.inverted) {
				continue
			}
			const value = core.ResourceLocationNode.toString(
				valueNode.value,
				'full',
				true,
			)
			if (value.startsWith(core.ResourceLocation.TagPrefix)) {
				const tagValues = getTagValues(
					'tag/entity_type',
					value.slice(1),
					ctx,
				)
				if (types === undefined) {
					types = tagValues.map(core.ResourceLocation.lengthen)
				} else {
					types = types.filter((t) => tagValues.includes(t))
				}
			} else {
				types = [value as core.FullResourceLocation]
			}
		}
		return types
	}

	return undefined
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<mcf.CommandNode>('mcfunction:command', command)
	meta.registerChecker<BlockNode>('mcfunction:block', block)
	meta.registerChecker<EntityNode>('mcfunction:entity', entity)
	meta.registerChecker<ItemStackNode>('mcfunction:item_stack', itemStack)
	meta.registerChecker<ItemPredicateNode>(
		'mcfunction:item_predicate',
		itemPredicate,
	)
	meta.registerChecker<JsonNode>('mcfunction:json', jsonChecker)
	meta.registerChecker<ParticleNode>('mcfunction:particle', particle)
}
