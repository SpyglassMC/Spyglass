import * as core from '@spyglassmc/core'
import type * as mcf from '@spyglassmc/mcfunction'
import { ColorArgumentValues, SwizzleArgumentValues } from '../common'
import type { VectorNode } from '../node'
import type { ArgumentTreeNode } from '../tree'

export function argument(rawTreeNode: mcf.ArgumentTreeNode): core.StartableCompleter<any> | undefined {
	const treeNode = rawTreeNode as ArgumentTreeNode

	switch (treeNode.parser) {
		case 'brigadier:bool':
			return core.completer.boolean
		case 'brigadier:double':
		case 'brigadier:float':
		case 'brigadier:integer':
		case 'brigadier:long':
			return core.completer.noop
		case 'brigadier:string':
			return core.StartableCompleter.create((_node, ctx) => [
				core.CompletionItem.create('""', ctx.offset),
				core.CompletionItem.create("''", ctx.offset),
			])
		case 'minecraft:angle':
			return core.StartableCompleter.create((node, ctx) => [
				core.CompletionItem.create('~', node ?? ctx.offset),
			])
		case 'minecraft:block_pos':
			return vector(3)
		case 'minecraft:color':
			return core.StartableCompleter.create(
				(node, ctx) => ColorArgumentValues.map(v => core.CompletionItem.create(v, node ?? ctx.offset))
			)
		case 'minecraft:column_pos':
			return vector(2)
		case 'minecraft:swizzle':
			return core.StartableCompleter.create(
				(node, ctx) => SwizzleArgumentValues.map(v => core.CompletionItem.create(v, node ?? ctx.offset))
			)
		case 'minecraft:vec2':
			return vector(2, true)
		case 'minecraft:vec3':
			return vector(3)
		//
		case 'minecraft:block_predicate':
		case 'minecraft:block_state':
		case 'minecraft:component':
		case 'minecraft:dimension':
		case 'minecraft:entity':
		case 'minecraft:entity_anchor':
		case 'minecraft:entity_summon':
		case 'minecraft:float_range':
		case 'minecraft:function':
		case 'minecraft:game_profile':
		case 'minecraft:int_range':
		case 'minecraft:item_enchantment':
		case 'minecraft:item_predicate':
		case 'minecraft:item_slot':
		case 'minecraft:item_stack':
		case 'minecraft:message':
		case 'minecraft:mob_effect':
		case 'minecraft:nbt_compound_tag':
		case 'minecraft:nbt_path':
		case 'minecraft:nbt_tag':
		case 'minecraft:objective':
		case 'minecraft:objective_criteria':
		case 'minecraft:operation':
		case 'minecraft:particle':
		case 'minecraft:resource':
		case 'minecraft:resource_or_tag':
		case 'minecraft:resource_location':
		case 'minecraft:rotation':
		case 'minecraft:score_holder':
		case 'minecraft:scoreboard_slot':
		case 'minecraft:team':
		case 'minecraft:time':
		case 'minecraft:uuid':
		case 'spyglassmc:tag':
		default:
			// Unknown parser.
			return undefined
	}
}

function vector(dimension: 2 | 3, noLocal = false): core.StartableCompleter<VectorNode> {
	return core.StartableCompleter.create<VectorNode>((node, ctx) => {
		const createText = (notation: '~' | '^') => new Array(dimension).fill(notation).join(' ')

		const ans: string[] = []
		ans.push(createText('~'))
		if (!noLocal) {
			ans.push(createText('^'))
		}

		return ans.map(v => core.CompletionItem.create(v, node ?? ctx.offset))
	})
}
