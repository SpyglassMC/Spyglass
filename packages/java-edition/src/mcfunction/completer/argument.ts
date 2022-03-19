import * as core from '@spyglassmc/core'
import type * as mcf from '@spyglassmc/mcfunction'
import { ColorArgumentValues, EntityAnchorArgumentValues, ItemSlotArgumentValues, OperationArgumentValues, SwizzleArgumentValues } from '../common'
import { VectorNode } from '../node'
import type { ArgumentTreeNode } from '../tree'

/** @deprecated */
const ParsersToNodes = new Map<core.FullResourceLocation, string>([
	['brigadier:bool', 'boolean'],
	['brigadier:double', 'float'],
	['brigadier:float', 'float'],
	['brigadier:integer', 'integer'],
	['brigadier:long', 'long'],
	['brigadier:string', 'string'],
	['minecraft:angle', 'mcfunction:coordinate'],
	['minecraft:block_pos', 'mcfunction:vector'],
	['minecraft:block_predicate', 'mcfunction:block'],
	['minecraft:block_state', 'mcfunction:block'],
	['minecraft:color', 'literal'],
	['minecraft:column_pos', 'mcfunction:vector'],
	['minecraft:component', 'json:entry'],
	['minecraft:dimension', 'resource_location'],
	['minecraft:entity', 'mcfunction:entity'],
	['minecraft:entity_anchor', 'literal'],
	['minecraft:entity_summon', 'resource_location'],
	['minecraft:float_range', 'mcfunction:float_range'],
	['minecraft:function', 'resource_location'],
	['minecraft:game_profile', 'mcfunction:entity'],
	['minecraft:int_range', 'mcfunction:int_range'],
	['minecraft:item_enchantment', 'resource_location'],
	['minecraft:item_predicate', 'mcfunction:item'],
	['minecraft:item_slot', 'literal'],
	['minecraft:item_stack', 'mcfunction:item'],
	['minecraft:message', 'mcfunction:message'],
	['minecraft:mob_effect', 'resource_location'],
	['minecraft:nbt_compound_tag', 'nbt:compound'],
	['minecraft:nbt_path', 'nbt:path'],
	['minecraft:nbt_tag', 'nbt:entry'],
	['minecraft:objective', 'symbol'],
	['minecraft:objective_criteria', ''], // TODO
	['minecraft:operation', 'literal'],
	['minecraft:particle', ''], // TODO
	['minecraft:resource', 'resource_location'],
	['minecraft:resource_location', 'resource_location'],
	['minecraft:resource_or_tag', 'resource_location'],
	['minecraft:rotation', 'mcfunction:vector'],
	['minecraft:score_holder', 'mcfunction:score_holder'],
	['minecraft:scoreboard_slot', 'literal'],
	['minecraft:swizzle', 'literal'],
	['minecraft:team', 'symbol'],
	['minecraft:time', 'mcfunction:time'],
	['minecraft:uuid', 'mcfunction:uuid'],
	['minecraft:vec2', 'mcfunction:vector'],
	['minecraft:vec3', 'mcfunction:vector'],
	['spyglassmc:tag', 'symbol'],
])

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
			// FIXME ?
			return [
				core.CompletionItem.create('""', offset),
				core.CompletionItem.create("''", offset),
			]
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
			// FIXME ?
			return [core.CompletionItem.create('-2147483648..2147483647', offset, { kind: core.CompletionKind.Constant })]
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
		case 'minecraft:component':
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
		case 'minecraft:scoreboard_slot':
		default:
			// Unknown parser.
			return []
	}
}

const vector: core.Completer<VectorNode> = (node, _ctx) => {
	const createText = (notation: '~' | '^') => new Array(node.options.dimension).fill(notation).join(' ')

	const ans: string[] = []
	ans.push(createText('~'))
	if (!node.options.noLocal) {
		ans.push(createText('^'))
	}

	return ans.map(v => core.CompletionItem.create(v, node))
}

export function register(meta: core.MetaRegistry) {
	meta.registerCompleter<VectorNode>('mcfunction:vector', vector)
}
