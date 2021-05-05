import { as, boolean, dispatch, int, intRange, listOf, object, opt, pick, record, ref, resource } from '@spyglassmc/json/lib/checker/primitives'
import { number_provider } from './common'
import { item_modifier } from './item_modifier'
import { predicate } from './predicate'

export const loot_entry = as('loot_entry', dispatch('type',
	(type) => record({
		type: resource('loot_pool_entry_type'),
		weight: opt(intRange(1, null)),
		quality: opt(int),
		...pick(type, {
			alternatives: {
				children: listOf(loot_entry),
			},
			dynamic: {
				name: resource(['contents']),
			},
			group: {
				children: listOf(loot_entry),
			},
			item: {
				name: resource('item'),
			},
			loot_table: {
				name: resource('loot_table'),
			},
			sequence: {
				children: listOf(loot_entry),
			},
			tag: {
				name: resource('tag/item'),
				expand: opt(boolean),
			},
		}),
		functions: opt(listOf(object())),
		conditions: opt(listOf(predicate)),
	})
))

export const loot_pool = as('loot_pool', record({
	rolls: number_provider,
	bonus_rolls: opt(number_provider),
	entries: listOf(loot_entry),
	functions: opt(listOf(ref(() => item_modifier))),
	conditions: opt(listOf(predicate)),
}))

const loot_context_types = [
	'minecraft:empty',
	'minecraft:chest',
	'minecraft:command',
	'minecraft:selector',
	'minecraft:fishing',
	'minecraft:entity',
	'minecraft:gift',
	'minecraft:barter',
	'minecraft:advancement_reward',
	'minecraft:advancement_entity',
	'minecraft:generic',
	'minecraft:block',
]

export const loot_table = as('loot_table', record({
	type: opt(resource(loot_context_types)),
	pools: opt(listOf(loot_pool)),
	functions: opt(listOf(ref(() => item_modifier))),
}))
