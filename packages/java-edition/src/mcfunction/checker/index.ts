import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales/lib'
import * as mcf from '@spyglassmc/mcfunction'
import * as nbt from '@spyglassmc/nbt'
import * as nbtdoc from '@spyglassmc/nbtdoc'
import { getTagValues } from '../../common'
import type { CommandNode, EntitySelectorInvertableArgumentValueNode, MinecraftEntityArgumentNode } from '../node'
import { EntitySelectorArgumentsNode } from '../node'

export const command: core.Checker<CommandNode> = (node, ctx) => {
	if (node.slash && node.parent && mcf.McfunctionNode.is(node.parent)) {
		ctx.err.report(localize('unexpected-leading-slash'), node.slash)
	}
	rootCommand(node.children, 0, ctx)
}

const rootCommand = (nodes: CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	if (nodes[index]?.name === 'data') {
		if (nodes[index + 1]?.name === 'get') {
			nbtPath(nodes, index + 2, ctx)
		} else if (nodes[index + 1]?.name === 'merge') {
			dataMergeTarget(nodes, index + 2, ctx)
		} else if (nodes[index + 1]?.name === 'modify') {
			nbtPath(nodes, index + 2, ctx)
			const targetPath = nodes[index + 4]
			const operation = nodes[index + 5]?.name
			const sourceTypeIndex = operation === 'insert' ? index + 7 : index + 6
			if (nodes[sourceTypeIndex]?.name === 'from') {
				// `from <$nbtPath$>`
				nbtPath(nodes, sourceTypeIndex + 1, ctx)
				const sourcePath = nodes[sourceTypeIndex + 3]
				if (targetPath?.type === 'nbt:path' && sourcePath?.type === 'nbt:path') {
					const { errorMessage } = nbtdoc.checker.checkAssignability({ source: sourcePath.targetType, target: targetPath.targetType })
					if (errorMessage) {
						ctx.err.report(errorMessage, core.Range.span(targetPath, sourcePath), core.ErrorSeverity.Warning)
					}
				}
			} else if (nodes[sourceTypeIndex]?.name === 'value') {
				// `value <value: nbt_tag>`
				const valueNode = nodes[sourceTypeIndex + 1]
				if (targetPath?.type === 'nbt:path' && targetPath.targetType && valueNode && nbt.NbtNode.is(valueNode)) {
					nbt.checker.fieldValue(targetPath.targetType, { allowUnknownKey: true })(valueNode, ctx)
				}
			}
		} else if (nodes[index + 1]?.name === 'remove') {
			nbtPath(nodes, index + 2, ctx)
		}
	} else if (nodes[index]?.name === 'execute') {
		for (let i = index + 1; i < nodes.length; i++) {
			if ((nodes[i].name === 'if' || nodes[i].name === 'unless') && nodes[i + 1]?.name === 'data') {
				// `if|unless data <$nbtPath$>`
				nbtPath(nodes, i + 2, ctx)
				i += 2
			} else if (nodes[i].name === 'run') {
				rootCommand(nodes, i + 1, ctx)
				break
			}
		}
	} else if (nodes[index]?.name === 'summon') {
		summonNbt(nodes, index + 1, ctx)
	}
}

/**
 * - `block <targetPos: block_pos> <nbt: nbt_compound_tag>`
 * - `entity <target: entity> <nbt: nbt_compound_tag>`
 * - `storage <target: resource_location> <nbt: nbt_compound_tag>`
 */
const dataMergeTarget = (nodes: CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const registry = nodes[index]?.name
	switch (registry) {
		case 'block': {
			const nbtNode = nodes[index + 2]
			if (nbtNode?.type === 'nbt:compound') {
				nbt.checker.index('block', undefined)(nbtNode, ctx)
			}
			break
		}
		case 'entity': {
			const entityNode = nodes[index + 1]
			const nbtNode = nodes[index + 2]
			if (entityNode?.type === 'mcfunction:argument/minecraft:entity' && nbtNode?.type === 'nbt:compound') {
				const types = getTypesFromEntity(entityNode, ctx)
				nbt.checker.index('entity_type', types)(nbtNode, ctx)
			}
			break
		}
		case 'storage': {
			const idNode = nodes[index + 1]
			const nbtNode = nodes[index + 2]
			if (idNode?.type === 'mcfunction:argument/minecraft:resource_location' && nbtNode?.type === 'nbt:compound') {
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
const nbtPath = (nodes: CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const registry = nodes[index]?.name
	switch (registry) {
		case 'block': {
			const nbtNode = nodes[index + 2]
			if (nbtNode?.type === 'nbt:path') {
				nbt.checker.path('block', undefined)(nbtNode, ctx)
			}
			break
		}
		case 'entity': {
			const entityNode = nodes[index + 1]
			const nbtNode = nodes[index + 2]
			if (entityNode?.type === 'mcfunction:argument/minecraft:entity' && nbtNode?.type === 'nbt:path') {
				const types = getTypesFromEntity(entityNode, ctx)
				nbt.checker.path('entity_type', types)(nbtNode, ctx)
			}
			break
		}
		case 'storage': {
			const idNode = nodes[index + 1]
			const nbtNode = nodes[index + 2]
			if (idNode?.type === 'mcfunction:argument/minecraft:resource_location' && nbtNode?.type === 'nbt:path') {
				nbt.checker.path('storage', core.ResourceLocationNode.toString(idNode, 'full'))(nbtNode, ctx)
			}
			break
		}
	}
}

/**
 * - `<entity: entity_summon> [<pos: vec3>] [<nbt: nbt_compound_tag>]`
 */
const summonNbt = (nodes: CommandNode['children'], index: number, ctx: core.CheckerContext) => {
	const typeNode = nodes[index]
	const nbtNode = nodes[index + 2]
	if (typeNode?.type === 'mcfunction:argument/minecraft:entity_summon' && nbtNode?.type === 'nbt:compound') {
		nbt.checker.index('entity_type', core.ResourceLocationNode.toString(typeNode, 'full'))(nbtNode, ctx)
	}
}

export const getTypesFromEntity = (entity: MinecraftEntityArgumentNode, ctx: core.CheckerContext): core.FullResourceLocation[] | undefined => {
	if (entity.playerName !== undefined || entity.selector?.playersOnly) {
		return ['minecraft:player']
	} else if (entity.selector) {
		const argumentsNode = entity.selector.children.find(EntitySelectorArgumentsNode.is)
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
	meta.registerChecker<CommandNode>('mcfunction:command', command)
}
