import { as, dispatch, int, intRange, listOf, opt, pick, record, resource, string } from '../primitives'

const item_modifier = record({})
const predicate = record({})

export const loot_entry = as('loot_entry', dispatch('type', resource('loot_pool_entry_type'),
	(type) => record({
		weight: opt(intRange(1, null)),
		quality: opt(int),
		...pick(type, {
			alternatives: {
				children: listOf(loot_entry),
			},
			dynamic: {
				name: string,
			},
			group: {
				children: listOf(loot_entry),
			},
			item: {
				name: resource('item'),
			},
			loot_table: {
				name: resource('$loot_table'),
			},
			sequence: {
				children: listOf(loot_entry),
			},
			tag: {
				name: resource('$tag/item'),
			},
		}),
		functions: opt(listOf(item_modifier)),
		conditions: opt(listOf(predicate)),
	})
))

export const loot_pool = as('loot_pool', record({
	rolls: int,
	bonus_rolls: opt(int),
	entries: listOf(loot_entry),
	functions: opt(listOf(item_modifier)),
	conditions: opt(listOf(predicate)),
}))

export const loot_table = as('loot_table', record({
	type: opt(string),
	pools: opt(listOf(loot_pool)),
	functions: opt(listOf(item_modifier)),
}))
