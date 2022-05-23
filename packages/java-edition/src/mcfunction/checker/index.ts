import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localize } from '@spyglassmc/locales'
import * as mcf from '@spyglassmc/mcfunction'
import * as nbt from '@spyglassmc/nbt'
import { getTagValues } from '../../common/index.js'
import { text_component } from '../../json/checker/data/text_component.js'
import type { EntitySelectorInvertableArgumentValueNode } from '../node/index.js'
import { BlockNode, EntityNode, ItemNode, ParticleNode } from '../node/index.js'

export const command: core.Checker<mcf.CommandNode> = (node, ctx) => {
	if (node.slash && node.parent && mcf.McfunctionNode.is(node.parent)) {
		ctx.err.report(localize('unexpected-leading-slash'), node.slash)
	}
	rootCommand(node.children, 0, ctx)
}

const getName = (nodes: mcf.CommandNode['children'], index: number): string | undefined => {
	return nodes[index]?.path[nodes[index].path.length - 1]
}
const getNode = (nodes: mcf.CommandNode['children'], index: number): core.AstNode | undefined => {
	return nodes[index]?.children[0]
}

const rootCommand = (nodes: mcf.CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	for (const { children: [node] } of nodes) {
		if (BlockNode.is(node)) {
			block(node, ctx)
		} else if (EntityNode.is(node)) {
			entity(node, ctx)
		} else if (ItemNode.is(node)) {
			item(node, ctx)
		} else if (ParticleNode.is(node)) {
			particle(node, ctx)
		} else if (json.JsonNode.is(node)) {
			text_component(node, { ...ctx, context: '' })
		}
	}

	if (getName(nodes, index) === 'data') {
		if (getName(nodes, index + 1) === 'get') {
			nbtPath(nodes, index + 2, ctx)
		} else if (getName(nodes, index + 1) === 'merge') {
			dataMergeTarget(nodes, index + 2, ctx)
		} else if (getName(nodes, index + 1) === 'modify') {
			nbtPath(nodes, index + 2, ctx)
			const targetPath = getNode(nodes, index + 4)
			// if (nbt.NbtPathNode.is(targetPath)) {
			// 	const operationNode = getNode(nodes, index + 5)
			// 	const operation = getName(nodes, index + 5) as 'append' | 'insert' | 'merge' | 'prepend' | 'set' | undefined
			// 	const sourceTypeIndex = operation === 'insert' ? index + 7 : index + 6
			// 	let targetMcdocType: mcdoc.McdocType | undefined = targetPath.targetType ? mcdoc.simplifyType(targetPath.targetType) : undefined
			// 	const isType = (type: mcdoc.McdocType['kind']) => !targetMcdocType || targetMcdocType.kind === type || (targetMcdocType.type === 'union' && targetMcdocType.members.some(m => m.type === type))
			// 	if (operation === 'merge') {
			// 		if (!(isType('compound') || isType('index'))) {
			// 			ctx.err.report(
			// 				localize('mcfunction.checker.command.data-modify-unapplicable-operation', localeQuote(operation), localize('nbt.node.compound'), localeQuote(mcdoc.McdocType.toString(targetMcdocType))),
			// 				core.Range.span(targetPath, operationNode!),
			// 				core.ErrorSeverity.Warning
			// 			)
			// 			targetMcdocType = undefined
			// 		}
			// 	} else if (operation === 'append' || operation === 'insert' || operation === 'prepend') {
			// 		if (isType('list') || isType('byte_array') || isType('int_array') || isType('long_array')) {
			// 			if (targetMcdocType?.type === 'list') {
			// 				targetMcdocType = targetMcdocType.item
			// 			} else if (targetMcdocType?.type === 'byte_array') {
			// 				targetMcdocType = { type: 'byte', valueRange: targetMcdocType.valueRange }
			// 			} else if (targetMcdocType?.type === 'int_array') {
			// 				targetMcdocType = { type: 'int', valueRange: targetMcdocType.valueRange }
			// 			} else if (targetMcdocType?.type === 'long_array') {
			// 				targetMcdocType = { type: 'long', valueRange: targetMcdocType.valueRange }
			// 			}
			// 		} else {
			// 			ctx.err.report(
			// 				localize('mcfunction.checker.command.data-modify-unapplicable-operation', localeQuote(operation), localize('nbt.node.list'), localeQuote(mcdoc.McdocType.toString(targetMcdocType))),
			// 				core.Range.span(targetPath, operationNode!),
			// 				core.ErrorSeverity.Warning
			// 			)
			// 			targetMcdocType = undefined
			// 		}
			// 	}
			// 	if (targetMcdocType) {
			// 		if (getName(nodes, sourceTypeIndex) === 'from') {
			// 			// `from <$nbtPath$>`
			// 			nbtPath(nodes, sourceTypeIndex + 1, ctx)
			// 			const sourcePath = getNode(nodes, sourceTypeIndex + 3)
			// 			if (nbt.NbtPathNode.is(sourcePath)) {
			// 				const { errorMessage } = mcdoc.checkAssignability({ source: sourcePath.targetType, target: targetMcdocType })
			// 				if (errorMessage) {
			// 					ctx.err.report(errorMessage, core.Range.span(targetPath, sourcePath), core.ErrorSeverity.Warning)
			// 				}
			// 			}
			// 		} else if (getName(nodes, sourceTypeIndex) === 'value') {
			// 			// `value <value: nbt_tag>`
			// 			const valueNode = getNode(nodes, sourceTypeIndex + 1)
			// 			if (nbt.NbtNode.is(valueNode)) {
			// 				nbt.checker.fieldValue(targetMcdocType, { allowUnknownKey: true })(valueNode, ctx)
			// 			}
			// 		}
			// 	}
			// }
		} else if (getName(nodes, index + 1) === 'remove') {
			nbtPath(nodes, index + 2, ctx)
		}
	} else if (getName(nodes, index) === 'execute') {
		for (let i = index + 1; i < nodes.length; i++) {
			if ((getName(nodes, i) === 'if' || getName(nodes, i) === 'unless') && getName(nodes, i + 1) === 'data') {
				// `if|unless data <$nbtPath$>`
				nbtPath(nodes, i + 2, ctx)
				i += 2
			} else if (getName(nodes, i) === 'run') {
				rootCommand(nodes, i + 1, ctx)
				break
			}
		}
	} else if (getName(nodes, index) === 'summon') {
		summonNbt(nodes, index + 1, ctx)
	}
}

//#region Checkers for argument nodes
const block: core.Checker<BlockNode> = (node, ctx) => {
	if (!node.nbt) {
		return
	}

	nbt.checker.index('block', core.ResourceLocationNode.toString(node.id, 'full'))(node.nbt, ctx)
}

const entity: core.Checker<EntityNode> = (node, ctx) => {
	const nbtPair = node.selector?.arguments?.children.find(pair => pair.key?.value === 'nbt')
	if (!nbtPair) {
		return
	}

	const types = getTypesFromEntity(node, ctx)
	const nbtValue = nbtPair.value as nbt.NbtCompoundNode
	nbt.checker.index('entity_type', types)(nbtValue, ctx)
}

const item: core.Checker<ItemNode> = (node, ctx) => {
	if (!node.nbt) {
		return
	}

	nbt.checker.index('item', core.ResourceLocationNode.toString(node.id, 'full'))(node.nbt, ctx)
}

const particle: core.Checker<ParticleNode> = (node, ctx) => {
	core.checker.dispatchSync(node, ctx)
}
//#endregion

//#region Checkers for command argument structure.
/**
 * - `block <targetPos: block_pos> <nbt: nbt_compound_tag>`
 * - `entity <target: entity> <nbt: nbt_compound_tag>`
 * - `storage <target: resource_location> <nbt: nbt_compound_tag>`
 */
const dataMergeTarget = (nodes: mcf.CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const registry = getName(nodes, index)
	switch (registry) {
		case 'block': {
			const nbtNode = getNode(nodes, index + 2)
			if (nbt.NbtCompoundNode.is(nbtNode)) {
				nbt.checker.index('block', undefined)(nbtNode, ctx)
			}
			break
		}
		case 'entity': {
			const entityNode = getNode(nodes, index + 1)
			const nbtNode = getNode(nodes, index + 2)
			if (EntityNode.is(entityNode) && nbt.NbtCompoundNode.is(nbtNode)) {
				const types = getTypesFromEntity(entityNode, ctx)
				nbt.checker.index('entity_type', types)(nbtNode, ctx)
			}
			break
		}
		case 'storage': {
			const idNode = getNode(nodes, index + 1)
			const nbtNode = getNode(nodes, index + 2)
			if (core.ResourceLocationNode.is(idNode) && nbt.NbtCompoundNode.is(nbtNode)) {
				nbt.checker.index('storage', core.ResourceLocationNode.toString(idNode, 'full'))(nbtNode, ctx)
			}
			break
		}
	}
}

/**
 * - `block <block_pos> <nbt_path>`
 * - `entity <entity> <nbt_path>`
 * - `storage <resource_location> <nbt_path>`
 */
const nbtPath = (nodes: mcf.CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const registry = getName(nodes, index)
	switch (registry) {
		case 'block': {
			const nbtNode = getNode(nodes, index + 2)
			if (nbt.NbtPathNode.is(nbtNode)) {
				nbt.checker.path('block', undefined)(nbtNode, ctx)
			}
			break
		}
		case 'entity': {
			const entityNode = getNode(nodes, index + 1)
			const nbtNode = getNode(nodes, index + 2)
			if (EntityNode.is(entityNode) && nbt.NbtPathNode.is(nbtNode)) {
				const types = getTypesFromEntity(entityNode, ctx)
				nbt.checker.path('entity_type', types)(nbtNode, ctx)
			}
			break
		}
		case 'storage': {
			const idNode = getNode(nodes, index + 1)
			const nbtNode = getNode(nodes, index + 2)
			if (core.ResourceLocationNode.is(idNode) && nbt.NbtPathNode.is(nbtNode)) {
				nbt.checker.path('storage', core.ResourceLocationNode.toString(idNode, 'full'))(nbtNode, ctx)
			}
			break
		}
	}
}

/**
 * - `<entity: entity_summon> [<pos: vec3>] [<nbt: nbt_compound_tag>]`
 */
const summonNbt = (nodes: mcf.CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const typeNode = getNode(nodes, index)
	const nbtNode = getNode(nodes, index + 2)
	if (core.ResourceLocationNode.is(typeNode) && nbt.NbtCompoundNode.is(nbtNode)) {
		nbt.checker.index('entity_type', core.ResourceLocationNode.toString(typeNode, 'full'))(nbtNode, ctx)
	}
}
//#endregion

export const getTypesFromEntity = (entity: EntityNode, ctx: core.CheckerContext): core.FullResourceLocation[] | undefined => {
	if (entity.playerName !== undefined || entity.selector?.playersOnly) {
		return ['minecraft:player']
	} else if (entity.selector) {
		const argumentsNode = entity.selector.arguments
		if (!argumentsNode) {
			return undefined
		}
		let types: core.FullResourceLocation[] = []
		for (const pairNode of argumentsNode.children) {
			if (pairNode.key?.value !== 'type') {
				continue
			}
			const valueNode = pairNode.value as EntitySelectorInvertableArgumentValueNode<core.ResourceLocationNode> | undefined
			if (!valueNode || valueNode.inverted) {
				continue
			}
			const value = core.ResourceLocationNode.toString(valueNode.value, 'full')
			if (value.startsWith(core.ResourceLocation.TagPrefix)) {
				const tagValues = getTagValues('tag/entity_type', value.slice(1), ctx)
				types = types.filter(t => tagValues.includes(t))
			} else {
				types = [value]
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
	meta.registerChecker<ItemNode>('mcfunction:item', item)
	meta.registerChecker<ParticleNode>('mcfunction:particle', particle)
}
