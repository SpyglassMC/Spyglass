import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import type * as mcf from '@spyglassmc/mcfunction'
import { ColorArgumentValues, EntityAnchorArgumentValues, ItemSlotArgumentValues, OperationArgumentValues, ScoreboardSlotArgumentValues, SwizzleArgumentValues } from '../common'
import type { EntityNode} from '../node'
import { IntRangeNode, VectorNode } from '../node'
import type { ArgumentTreeNode } from '../tree'

export const argument: mcf.completer.ArgumentSuggester = (rawTreeNode, ctx): readonly core.CompletionItem[] => {
	const treeNode = rawTreeNode as ArgumentTreeNode
	const { offset } = ctx

	switch (treeNode.parser) {
		case 'brigadier:bool':
			return core.completer.boolean(core.BooleanNode.mock(offset), ctx)
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
				? core.completer.string(core.StringNode.mock(offset, core.BrigadierStringOptions), ctx)
				: []
		case 'minecraft:angle':
			// FIXME ?
			return [core.CompletionItem.create('~', offset)]
		case 'minecraft:block_pos':
			return vector(VectorNode.mock(offset, {
				dimension: 3,
				integersOnly: true,
			}), ctx)
		case 'minecraft:color':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: ColorArgumentValues,
			}), ctx)
		case 'minecraft:column_pos':
			return vector(VectorNode.mock(offset, {
				dimension: 2,
				integersOnly: true,
			}), ctx)
		case 'minecraft:component':
			return [
				...json.completer.entry(json.JsonArrayNode.mock(offset), ctx),
				...json.completer.entry(json.JsonObjectNode.mock(offset), ctx),
				...json.completer.entry(json.JsonStringNode.mock(offset), ctx),
			]
		case 'minecraft:dimension':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: 'dimension',
			}), ctx)
		case 'minecraft:entity_anchor':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: EntityAnchorArgumentValues,
			}), ctx)
		case 'minecraft:entity_summon':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: 'entity_type',
			}), ctx)
		case 'minecraft:function':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: 'function',
			}), ctx)
		case 'minecraft:int_range':
			return intRange(IntRangeNode.mock(offset), ctx)
		case 'minecraft:item_enchantment':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: 'enchantment',
			}), ctx)
		case 'minecraft:item_slot':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: ItemSlotArgumentValues,
			}), ctx)
		case 'minecraft:mob_effect':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: 'mob_effect',
			}), ctx)
		case 'minecraft:objective':
			return core.completer.symbol(core.SymbolNode.mock(offset, {
				category: 'objective',
			}), ctx)
		case 'minecraft:operation':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: OperationArgumentValues,
				colorTokenType: 'operator',
			}), ctx)
		case 'minecraft:resource':
		case 'minecraft:resource_or_tag':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, {
				category: core.ResourceLocation.shorten(treeNode.properties.registry) as core.RegistryCategory | core.WorldgenFileCategory,
				allowTag: treeNode.parser === 'minecraft:resource_or_tag',
			}), ctx)
		case 'minecraft:resource_location':
			return core.completer.resourceLocation(core.ResourceLocationNode.mock(offset, treeNode.properties ?? {
				pool: [],
				allowUnknown: true,
			}), ctx)
		case 'minecraft:rotation':
			return vector(VectorNode.mock(offset, {
				dimension: 2,
				noLocal: true,
			}), ctx)
		case 'minecraft:scoreboard_slot':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: ScoreboardSlotArgumentValues,
			}), ctx)
		case 'minecraft:swizzle':
			return core.completer.literal(core.LiteralNode.mock(offset, {
				pool: SwizzleArgumentValues,
			}), ctx)
		case 'minecraft:team':
			return core.completer.symbol(core.SymbolNode.mock(offset, {
				category: 'team',
			}), ctx)
		case 'minecraft:vec2':
			return vector(VectorNode.mock(offset, {
				dimension: 2,
				integersOnly: true,
			}), ctx)
		case 'minecraft:vec3':
			return vector(VectorNode.mock(offset, {
				dimension: 3,
			}), ctx)
		case 'spyglassmc:tag':
			return core.completer.symbol(core.SymbolNode.mock(offset, {
				category: 'tag',
			}), ctx)
		//
		case 'minecraft:block_predicate':
		case 'minecraft:block_state':
		case 'minecraft:entity':
		case 'minecraft:game_profile':
		case 'minecraft:item_predicate':
		case 'minecraft:item_stack':
		case 'minecraft:nbt_compound_tag':
		case 'minecraft:nbt_path':
		case 'minecraft:nbt_tag':
		case 'minecraft:objective_criteria':
		case 'minecraft:particle':
		case 'minecraft:score_holder':
		default:
			// Unknown parser.
			return []
	}
}

const entity: core.Completer<EntityNode> = (node, ctx) => {
	return []
}

const intRange: core.Completer<IntRangeNode> = (node, _ctx) => {
	return [core.CompletionItem.create('-2147483648..2147483647', node, { kind: core.CompletionKind.Constant })]
}

const vector: core.Completer<VectorNode> = (node, _ctx) => {
	const createCompletion = (coordinate: '~' | '^' | '0.0', sortText: string) => core.CompletionItem.create(
		new Array(node.options.dimension).fill(coordinate).join(' '),
		node,
		{ sortText },
	)

	const ans: core.CompletionItem[] = []
	ans.push(createCompletion('~', 'a'))
	if (!node.options.noLocal) {
		ans.push(createCompletion('^', 'b'))
	}
	ans.push(createCompletion('0.0', 'c'))

	return ans
}

export function register(meta: core.MetaRegistry) {
	meta.registerCompleter<VectorNode>('mcfunction:vector', vector)
}
