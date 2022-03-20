import type { Arrayable, Completer, MetaRegistry, RegistryCategory, WorldgenFileCategory } from '@spyglassmc/core'
import { AstNode, BooleanNode, BrigadierStringOptions, completer, CompletionItem, CompletionKind, getStates, LiteralNode, Range, ResourceLocation, ResourceLocationNode, StringNode, SymbolNode } from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import type * as mcf from '@spyglassmc/mcfunction'
import { getTagValues } from '../../common'
import { ColorArgumentValues, EntityAnchorArgumentValues, ItemSlotArgumentValues, OperationArgumentValues, ScoreboardSlotArgumentValues, SwizzleArgumentValues } from '../common'
import type { BlockStatesNode, EntityNode, ScoreHolderNode } from '../node'
import { BlockNode, CoordinateNode, IntRangeNode, ItemNode, ObjectiveCriteriaNode, ParticleNode, VectorNode } from '../node'
import type { ArgumentTreeNode } from '../tree'

export const getMockNodes: mcf.completer.MockNodesGetter = (rawTreeNode, range): Arrayable<AstNode> => {
	const treeNode = rawTreeNode as ArgumentTreeNode

	switch (treeNode.parser) {
		case 'brigadier:bool':
			return BooleanNode.mock(range)
		case 'brigadier:double':
		case 'brigadier:float':
		case 'brigadier:integer':
		case 'brigadier:long':
		case 'minecraft:float_range':
		case 'minecraft:message':
		case 'minecraft:time':
		case 'minecraft:uuid':
			return []
		case 'brigadier:string':
			return treeNode.properties.type === 'phrase'
				? StringNode.mock(range, BrigadierStringOptions)
				: []
		case 'minecraft:angle':
			return CoordinateNode.mock(range)
		case 'minecraft:block_pos':
			return VectorNode.mock(range, { dimension: 3, integersOnly: true })
		case 'minecraft:block_predicate':
			return BlockNode.mock(range, true)
		case 'minecraft:block_state':
			return BlockNode.mock(range, false)
		case 'minecraft:color':
			return LiteralNode.mock(range, { pool: ColorArgumentValues })
		case 'minecraft:column_pos':
			return VectorNode.mock(range, { dimension: 2, integersOnly: true })
		case 'minecraft:component':
			return [
				json.JsonArrayNode.mock(range),
				json.JsonObjectNode.mock(range),
				json.JsonStringNode.mock(range),
			]
		case 'minecraft:dimension':
			return ResourceLocationNode.mock(range, { category: 'dimension' })
		case 'minecraft:entity_anchor':
			return LiteralNode.mock(range, { pool: EntityAnchorArgumentValues })
		case 'minecraft:entity_summon':
			return ResourceLocationNode.mock(range, { category: 'entity_type' })
		case 'minecraft:function':
			return ResourceLocationNode.mock(range, { category: 'function' })
		case 'minecraft:int_range':
			return IntRangeNode.mock(range)
		case 'minecraft:item_enchantment':
			return ResourceLocationNode.mock(range, { category: 'enchantment' })
		case 'minecraft:item_predicate':
			return ItemNode.mock(range, true)
		case 'minecraft:item_slot':
			return LiteralNode.mock(range, { pool: ItemSlotArgumentValues })
		case 'minecraft:item_stack':
			return ItemNode.mock(range, false)
		case 'minecraft:mob_effect':
			return ResourceLocationNode.mock(range, { category: 'mob_effect' })
		case 'minecraft:objective':
			return SymbolNode.mock(range, { category: 'objective' })
		case 'minecraft:objective_criteria':
			return ObjectiveCriteriaNode.mock(range)
		case 'minecraft:operation':
			return LiteralNode.mock(range, { pool: OperationArgumentValues, colorTokenType: 'operator' })
		case 'minecraft:particle':
			return ParticleNode.mock(range)
		case 'minecraft:resource':
		case 'minecraft:resource_or_tag':
			return ResourceLocationNode.mock(range, {
				category: ResourceLocation.shorten(treeNode.properties.registry) as RegistryCategory | WorldgenFileCategory,
				allowTag: treeNode.parser === 'minecraft:resource_or_tag',
			})
		case 'minecraft:resource_location':
			return ResourceLocationNode.mock(range, treeNode.properties ?? { pool: [], allowUnknown: true })
		case 'minecraft:rotation':
			return VectorNode.mock(range, { dimension: 2, noLocal: true })
		case 'minecraft:scoreboard_slot':
			return LiteralNode.mock(range, { pool: ScoreboardSlotArgumentValues })
		case 'minecraft:swizzle':
			return LiteralNode.mock(range, { pool: SwizzleArgumentValues })
		case 'minecraft:team':
			return SymbolNode.mock(range, { category: 'team' })
		case 'minecraft:vec2':
			return VectorNode.mock(range, { dimension: 2, integersOnly: true })
		case 'minecraft:vec3':
			return VectorNode.mock(range, { dimension: 3 })
		case 'spyglassmc:tag':
			return SymbolNode.mock(range, { category: 'tag' })
		// ==== Unimplemented ====
		case 'minecraft:entity':
		case 'minecraft:game_profile':
		case 'minecraft:nbt_compound_tag':
		case 'minecraft:nbt_path':
		case 'minecraft:nbt_tag':
		case 'minecraft:score_holder':
		default:
			// Unknown parser.
			return []
	}
}

const block: Completer<BlockNode> = (node, ctx) => {
	const ans: CompletionItem[] = []
	if (Range.contains(node.id, ctx.offset, true)) {
		ans.push(...completer.resourceLocation(node.id, ctx))
	}
	if (node.states && Range.contains(Range.translate(node.states, 1, -1), ctx.offset, true)) {
		ans.push(...blockStates(node.states, ctx))
	}
	return ans
}

const blockStates: Completer<BlockStatesNode> = (node, ctx) => {
	if (!BlockNode.is(node.parent)) {
		return []
	}

	const idNode = node.parent.id
	const id = ResourceLocationNode.toString(idNode, 'full')
	const blocks = idNode.isTag ? getTagValues('tag/block', id, ctx) : [id]
	const states = getStates('block', blocks, ctx)
	const pairNode = AstNode.findChild(node, ctx.offset)
	// FIXME: Find selected PairNode more accurately.
	if (!pairNode || (pairNode.key && Range.contains(pairNode.key, ctx.offset, true))) {
		return Object.keys(states).map(v => CompletionItem.create(v, pairNode?.key ?? ctx.offset, { kind: CompletionKind.Property }))
	} else if (pairNode.key && pairNode.value && Range.contains(pairNode.value, ctx.offset, true)) {
		return states[pairNode.key.value]?.map(v => CompletionItem.create(v, pairNode.value ?? ctx.offset, { kind: CompletionKind.Value })) ?? []
	}
	return []
}

const coordinate: Completer<CoordinateNode> = (node, _ctx) => {
	return [CompletionItem.create('~', node)]
}

const entity: Completer<EntityNode> = (node, ctx) => {
	return []
}

const item: Completer<ItemNode> = (node, ctx) => {
	const ans: CompletionItem[] = []
	if (Range.contains(node.id, ctx.offset, true)) {
		ans.push(...completer.resourceLocation(node.id, ctx))
	}
	return ans
}

const objectiveCriteria: Completer<ObjectiveCriteriaNode> = (node, ctx) => {
	const ans = ObjectiveCriteriaNode.SimpleValues.map(v => CompletionItem.create(v, node))
	if (!node.children?.[0] || Range.contains(node.children[0], ctx.offset, true)) {
		ans.push(...completer.resourceLocation(
			node.children?.[0] ?? ResourceLocationNode.mock(node, { category: 'stat_type', namespacePathSep: '.' }), ctx
		))
	}
	if (node.children?.[1] && Range.contains(node.children[1], ctx.offset, true)) {
		ans.push(...completer.resourceLocation(node.children[1], ctx))
	}
	return ans
}

const particle: Completer<ParticleNode> = (node, ctx) => {
	return []
}

const scoreHolder: Completer<ScoreHolderNode> = (node, ctx) => {
	return []
}

const intRange: Completer<IntRangeNode> = (node, _ctx) => {
	return [CompletionItem.create('-2147483648..2147483647', node, { kind: CompletionKind.Constant })]
}

const vector: Completer<VectorNode> = (node, _ctx) => {
	const createCompletion = (coordinate: '~' | '^' | '0.0', sortText: string) => CompletionItem.create(
		new Array(node.options.dimension).fill(coordinate).join(' '),
		node,
		{ sortText },
	)

	const ans: CompletionItem[] = []
	ans.push(createCompletion('~', 'a'))
	if (!node.options.noLocal) {
		ans.push(createCompletion('^', 'b'))
	}
	ans.push(createCompletion('0.0', 'c'))

	return ans
}

export function register(meta: MetaRegistry) {
	meta.registerCompleter<BlockNode>('mcfunction:block', block)
	meta.registerCompleter<CoordinateNode>('mcfunction:coordinate', coordinate)
	meta.registerCompleter<EntityNode>('mcfunction:entity', entity)
	meta.registerCompleter<IntRangeNode>('mcfunction:int_range', intRange)
	meta.registerCompleter<ItemNode>('mcfunction:item', item)
	meta.registerCompleter<ObjectiveCriteriaNode>('mcfunction:objective_criteria', objectiveCriteria)
	meta.registerCompleter<ParticleNode>('mcfunction:particle', particle)
	meta.registerCompleter<ScoreHolderNode>('mcfunction:score_holder', scoreHolder)
	meta.registerCompleter<VectorNode>('mcfunction:vector', vector)
}
