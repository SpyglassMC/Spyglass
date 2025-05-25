import type {
	Arrayable,
	Completer,
	CompleterContext,
	DeepReadonly,
	MetaRegistry,
	Mutable,
	RegistryCategory,
	WorldgenFileCategory,
} from '@spyglassmc/core'
import {
	AstNode,
	binarySearch,
	BooleanNode,
	BrigadierStringOptions,
	completer,
	CompletionItem,
	CompletionKind,
	FloatNode,
	getStates,
	InsertTextBuilder,
	IntegerNode,
	LiteralNode,
	Range,
	ResourceLocation,
	ResourceLocationNode,
	StringNode,
	SymbolNode,
} from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localeQuote, localize } from '@spyglassmc/locales'
import type * as mcf from '@spyglassmc/mcfunction'
import type * as nbt from '@spyglassmc/nbt'
import { getTagValues } from '../../common/index.js'
import { ReleaseVersion } from '../../dependency/common.js'
import {
	ColorArgumentValues,
	EntityAnchorArgumentValues,
	GamemodeArgumentValues,
	getItemSlotArgumentValues,
	getItemSlotsArgumentValues,
	getScoreboardSlotArgumentValues,
	HeightmapValues,
	MirrorValues,
	OperationArgumentValues,
	RotationValues,
	SwizzleArgumentValues,
} from '../common/index.js'
import type {
	BlockStatesNode,
	ComponentListNode,
	ComponentTestsNode,
	EntitySelectorArgumentsNode,
} from '../node/index.js'
import {
	BlockNode,
	ComponentTestExactNode,
	ComponentTestSubpredicateNode,
	CoordinateNode,
	EntitySelectorAtVariable,
	EntitySelectorNode,
	IntRangeNode,
	ItemPredicateNode,
	ItemStackNode,
	ObjectiveCriteriaNode,
	ParticleNode,
	ScoreHolderNode,
	VectorNode,
} from '../node/index.js'
import type { ArgumentTreeNode } from '../tree/index.js'

export const getMockNodes: mcf.completer.MockNodesGetter = (
	rawTreeNode,
	prevNodes,
	ctx: CompleterContext,
): Arrayable<AstNode> => {
	const range = ctx.offset
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
		case 'minecraft:dialog':
			return ResourceLocationNode.mock(range, { category: 'dialog' })
		case 'minecraft:dimension':
			return ResourceLocationNode.mock(range, { category: 'dimension' })
		case 'minecraft:entity':
		case 'minecraft:game_profile':
			return EntitySelectorNode.mock(range, {
				pool: EntitySelectorAtVariable.filterAvailable(ctx),
			})
		case 'minecraft:heightmap':
			return LiteralNode.mock(range, { pool: HeightmapValues })
		case 'minecraft:entity_anchor':
			return LiteralNode.mock(range, { pool: EntityAnchorArgumentValues })
		case 'minecraft:entity_summon':
			return ResourceLocationNode.mock(range, { category: 'entity_type' })
		case 'minecraft:function':
			return ResourceLocationNode.mock(range, { category: 'function' })
		case 'minecraft:gamemode':
			return LiteralNode.mock(range, { pool: GamemodeArgumentValues })
		case 'minecraft:int_range':
			return IntRangeNode.mock(range)
		case 'minecraft:item_enchantment':
			return ResourceLocationNode.mock(range, { category: 'enchantment' })
		case 'minecraft:item_predicate':
			return ItemPredicateNode.mock(range)
		case 'minecraft:item_slot':
			return LiteralNode.mock(range, { pool: getItemSlotArgumentValues(ctx) })
		case 'minecraft:item_slots':
			return LiteralNode.mock(range, { pool: getItemSlotsArgumentValues(ctx) })
		case 'minecraft:item_stack':
			return ItemStackNode.mock(range)
		case 'minecraft:loot_modifier':
			return ResourceLocationNode.mock(range, { category: 'item_modifier' })
		case 'minecraft:loot_predicate':
			return ResourceLocationNode.mock(range, { category: 'predicate' })
		case 'minecraft:loot_table':
			return ResourceLocationNode.mock(range, { category: 'loot_table' })
		case 'minecraft:mob_effect':
			return ResourceLocationNode.mock(range, { category: 'mob_effect' })
		case 'minecraft:objective':
			return SymbolNode.mock(range, { category: 'objective' })
		case 'minecraft:objective_criteria':
			return ObjectiveCriteriaNode.mock(range)
		case 'minecraft:operation':
			return LiteralNode.mock(range, {
				pool: OperationArgumentValues,
				colorTokenType: 'operator',
			})
		case 'minecraft:particle':
			return ParticleNode.mock(range)
		case 'minecraft:resource':
		case 'minecraft:resource_key':
		case 'minecraft:resource_or_tag':
		case 'minecraft:resource_or_tag_key':
			const allowTag = treeNode.parser === 'minecraft:resource_or_tag'
				|| treeNode.parser === 'minecraft:resource_or_tag_key'
			return ResourceLocationNode.mock(range, {
				category: ResourceLocation.shorten(treeNode.properties.registry) as
					| RegistryCategory
					| WorldgenFileCategory,
				allowTag,
			})
		case 'minecraft:resource_location':
			return ResourceLocationNode.mock(
				range,
				treeNode.properties ?? { pool: [], allowUnknown: true },
			)
		case 'minecraft:rotation':
			return VectorNode.mock(range, { dimension: 2, noLocal: true })
		case 'minecraft:scoreboard_slot':
			return LiteralNode.mock(range, { pool: getScoreboardSlotArgumentValues(ctx) })
		case 'minecraft:score_holder':
			return ScoreHolderNode.mock(range)
		case 'minecraft:style':
			return json.JsonObjectNode.mock(range)
		case 'minecraft:swizzle':
			return LiteralNode.mock(range, { pool: SwizzleArgumentValues })
		case 'minecraft:team':
			return SymbolNode.mock(range, { category: 'team' })
		case 'minecraft:template_mirror':
			return LiteralNode.mock(range, { pool: MirrorValues })
		case 'minecraft:template_rotation':
			return LiteralNode.mock(range, { pool: RotationValues })
		case 'minecraft:vec2':
			return VectorNode.mock(range, { dimension: 2, integersOnly: true })
		case 'minecraft:vec3':
			return VectorNode.mock(range, { dimension: 3 })
		case 'spyglassmc:criterion':
			const advancementNode = prevNodes.length > 0
				? prevNodes[prevNodes.length - 1].children[0]
				: undefined
			if (ResourceLocationNode.is(advancementNode)) {
				return SymbolNode.mock(range, {
					category: 'advancement',
					subcategory: 'criterion',
					parentPath: [ResourceLocationNode.toString(advancementNode, 'full')],
				})
			}
			return []
		case 'spyglassmc:tag':
			return SymbolNode.mock(range, { category: 'tag' })
		// ==== Unimplemented ====
		case 'minecraft:nbt_compound_tag':
		case 'minecraft:nbt_path':
		case 'minecraft:nbt_tag':
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
	if (node.states?.innerRange && Range.contains(node.states.innerRange, ctx.offset, true)) {
		ans.push(...blockStates(node.states, ctx))
	}
	if (node.nbt?.innerRange && Range.contains(node.nbt.innerRange, ctx.offset, true)) {
		ans.push(...completer.dispatch(node.nbt, ctx))
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

	return completer.record<StringNode, StringNode, BlockStatesNode>({
		key: (_record, pair, _ctx, range, insertValue, insertComma, existingKeys) => {
			return Object.keys(states).filter((k) =>
				pair?.key?.value === k || !existingKeys.some((ek) => ek.value === k)
			).map((k) =>
				CompletionItem.create(k, range, {
					kind: CompletionKind.Property,
					detail: localize(
						'mcfunction.completer.block.states.default-value',
						localeQuote(states[k][0]),
					),
					insertText: new InsertTextBuilder().literal(k).if(
						insertValue,
						(b) => b.literal('=').placeholder(...states[k]),
					).if(insertComma, (b) => b.literal(',')).build(),
				})
			)
		},
		value: (_record, pair, ctx) => {
			if (pair.key && states[pair.key.value]) {
				return states[pair.key.value].map((v) =>
					CompletionItem.create(v, pair.value ?? ctx.offset, { kind: CompletionKind.Value })
				)
			}

			return []
		},
	})(node, ctx)
}

const componentList: Completer<ComponentListNode> = (node, ctx) => {
	if (!node.innerRange || !Range.contains(node.innerRange, ctx.offset, true)) {
		return []
	}

	const completeKey = (key: DeepReadonly<ResourceLocationNode> | undefined) => {
		const id = key
			?? ResourceLocationNode.mock(key ?? ctx.offset, { category: 'data_component_type' })
		return completer.resourceLocation(id, ctx)
	}

	const index = binarySearch(
		node.children,
		ctx.offset,
		(n, o) => Range.compareOffset(n.range, o, true),
	)
	const child = index >= 0 ? node.children[index] : undefined
	if (!child) {
		return [
			...completer.literal(LiteralNode.mock(ctx.offset, { pool: ['!'] }), ctx),
			...completeKey(undefined),
		]
	}

	if (child.type === 'mcfunction:component_removal') {
		return completeKey(child.key)
	}
	if ((child.key && Range.contains(child.key, ctx.offset, true))) {
		return completeKey(child.key)
	}
	if (child.value && Range.contains(child.value, ctx.offset, true)) {
		return completer.dispatch(child.value, ctx)
	}
	return []
}

const componentTests: Completer<ComponentTestsNode> = (node, ctx) => {
	// TODO: improve this completer
	const test = AstNode.findShallowestChild({
		node: node as Mutable<ComponentTestsNode>,
		needle: ctx.offset,
		endInclusive: true,
		predicate: (n) => ComponentTestExactNode.is(n) || ComponentTestSubpredicateNode.is(n),
	})
	if (test && ComponentTestExactNode.is(test) && test.value) {
		return completer.dispatch(test.value, ctx)
	} else if (test && ComponentTestSubpredicateNode.is(test) && test.value) {
		return completer.dispatch(test.value, ctx)
	}
	return []
}

const coordinate: Completer<CoordinateNode> = (node, _ctx) => {
	return [CompletionItem.create('~', node)]
}

const itemStack: Completer<ItemStackNode> = (node, ctx) => {
	const ans: CompletionItem[] = []
	if (Range.contains(node.id, ctx.offset, true)) {
		ans.push(...completer.resourceLocation(node.id, ctx))
	}
	if (node.components && Range.contains(node.components, ctx.offset, true)) {
		ans.push(...componentList(node.components, ctx))
	}
	if (node.nbt && Range.contains(node.nbt, ctx.offset, true)) {
		ans.push(...completer.dispatch(node.nbt, ctx))
	}
	return ans
}

const itemPredicate: Completer<ItemPredicateNode> = (node, ctx) => {
	const ans: CompletionItem[] = []
	if (Range.contains(node.id, ctx.offset, true)) {
		ans.push(CompletionItem.create('*', node, { sortText: '##' }))
		if (node.id.type === 'resource_location') {
			ans.push(...completer.resourceLocation(node.id, ctx))
		}
	}
	if (node.tests && Range.contains(node.tests, ctx.offset, true)) {
		ans.push(...componentTests(node.tests, ctx))
	}
	if (node.nbt && Range.contains(node.nbt, ctx.offset, true)) {
		ans.push(...completer.dispatch(node.nbt, ctx))
	}
	return ans
}

const objectiveCriteria: Completer<ObjectiveCriteriaNode> = (node, ctx) => {
	const ans = ObjectiveCriteriaNode.SimpleValues.map((v) => CompletionItem.create(v, node))
	if (!node.children?.[0] || Range.contains(node.children[0], ctx.offset, true)) {
		ans.push(
			...completer.resourceLocation(
				node.children?.[0]
					?? ResourceLocationNode.mock(node, { category: 'stat_type', namespacePathSep: '.' }),
				ctx,
			),
		)
	}
	if (node.children?.[1] && Range.contains(node.children[1], ctx.offset, true)) {
		ans.push(...completer.resourceLocation(node.children[1], ctx))
	}
	return ans
}

const particle: Completer<ParticleNode> = (node, ctx) => {
	const child = AstNode.findChild(node, ctx.offset, true)
	if (child) {
		return completer.dispatch(child, ctx)
	}
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	if (!release || ReleaseVersion.cmp(release, '1.20.5') >= 0) {
		return []
	}

	const id = ResourceLocationNode.toString(node.id, 'short')
	const map: Record<ParticleNode.SpecialType, AstNode[]> = {
		block: [BlockNode.mock(ctx.offset, false)],
		block_marker: [BlockNode.mock(ctx.offset, false)],
		dust: [VectorNode.mock(ctx.offset, { dimension: 3 }), FloatNode.mock(ctx.offset)],
		dust_color_transition: [
			VectorNode.mock(ctx.offset, { dimension: 3 }),
			FloatNode.mock(ctx.offset),
			VectorNode.mock(ctx.offset, { dimension: 3 }),
		],
		falling_dust: [BlockNode.mock(ctx.offset, false)],
		item: [ItemStackNode.mock(ctx.offset)],
		sculk_charge: [FloatNode.mock(ctx.offset)],
		shriek: [IntegerNode.mock(ctx.offset)],
		vibration: [
			VectorNode.mock(ctx.offset, { dimension: 3 }),
			VectorNode.mock(ctx.offset, { dimension: 3 }),
			IntegerNode.mock(ctx.offset),
		],
	}
	if (ParticleNode.isSpecialType(id)) {
		const numParamsBefore = node.children?.slice(1).filter((n) => n.range.end < ctx.offset).length
			?? 0
		const mock = map[id][numParamsBefore] as typeof map[keyof typeof map][number] | undefined
		if (mock) {
			return completer.dispatch(mock, ctx)
		}
	}

	return []
}

const scoreHolder: Completer<ScoreHolderNode> = (node, ctx) => {
	let ans: CompletionItem[]
	if (node.selector && Range.contains(node.selector, ctx.offset, true)) {
		ans = selector(node.selector, ctx)
		if (Range.contains(node.children[0], ctx.offset, true)) {
			ans.push(...completer.symbol(SymbolNode.mock(node, { category: 'score_holder' }), ctx))
		}
	} else {
		ans = completer.symbol(
			node.fakeName ?? SymbolNode.mock(node, { category: 'score_holder' }),
			ctx,
		)
		ans.push(
			...completer.literal(LiteralNode.mock(node, { pool: ['*'] }), ctx),
			...selector(
				EntitySelectorNode.mock(node, { pool: EntitySelectorAtVariable.filterAvailable(ctx) }),
				ctx,
			),
		)
	}
	return ans
}

const selector: Completer<EntitySelectorNode> = (node, ctx) => {
	if (Range.contains(node.children[0], ctx.offset, true)) {
		return completer.literal(node.children[0], ctx)
	}
	if (node.arguments?.innerRange && Range.contains(node.arguments.innerRange, ctx.offset, true)) {
		return selectorArguments(node.arguments, ctx)
	}
	return []
}

const selectorArguments: Completer<EntitySelectorArgumentsNode> = (node, ctx) => {
	const selector = node.parent
	if (!EntitySelectorNode.is(selector)) {
		return []
	}

	return completer.record<StringNode, any, EntitySelectorArgumentsNode>({
		key: (record, pair, _ctx, range, insertValue, insertComma) => {
			return [...EntitySelectorNode.ArgumentKeys].filter((k) =>
				EntitySelectorNode.canKeyExist(selector, record, k) === EntitySelectorNode.Result.Ok
			).map((k) =>
				CompletionItem.create(k, range, {
					kind: CompletionKind.Property,
					insertText: new InsertTextBuilder().literal(k).if(
						insertValue,
						(b) => b.literal('=').placeholder(),
					) // TODO
						.if(insertComma, (b) => b.literal(',')).build(),
				})
			)
		},
		value: (_record, pair, ctx) => {
			if (pair.value) {
				return completer.dispatch(pair.value, ctx)
			}
			return []
		},
	})(node, ctx)
}

const intRange: Completer<IntRangeNode> = (node, _ctx) => {
	return [
		CompletionItem.create('-2147483648..2147483647', node, { kind: CompletionKind.Constant }),
	]
}

const vector: Completer<VectorNode> = (node, _ctx) => {
	const createCompletion = (coordinate: '~' | '^' | '0.0', sortText: string) =>
		CompletionItem.create(new Array(node.options.dimension).fill(coordinate).join(' '), node, {
			sortText,
		})

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
	meta.registerCompleter<ComponentListNode>('mcfunction:component_list', componentList)
	meta.registerCompleter<ComponentTestsNode>('mcfunction:component_tests', componentTests)
	meta.registerCompleter<CoordinateNode>('mcfunction:coordinate', coordinate)
	meta.registerCompleter<EntitySelectorNode>('mcfunction:entity_selector', selector)
	meta.registerCompleter<EntitySelectorArgumentsNode>(
		'mcfunction:entity_selector/arguments',
		selectorArguments,
	)
	meta.registerCompleter<IntRangeNode>('mcfunction:int_range', intRange)
	meta.registerCompleter<ItemStackNode>('mcfunction:item_stack', itemStack)
	meta.registerCompleter<ItemPredicateNode>('mcfunction:item_predicate', itemPredicate)
	meta.registerCompleter<ObjectiveCriteriaNode>('mcfunction:objective_criteria', objectiveCriteria)
	meta.registerCompleter<ParticleNode>('mcfunction:particle', particle)
	meta.registerCompleter<ScoreHolderNode>('mcfunction:score_holder', scoreHolder)
	meta.registerCompleter<VectorNode>('mcfunction:vector', vector)
}
