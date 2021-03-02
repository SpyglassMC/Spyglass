import { any, as, boolean, dispatch, float, floatRange, int, listOf, opt, pick, record, resource, string } from '../primitives'
import { int_bounds, int_range } from './common'
import { loot_entry } from './loot_table'
import { predicate } from './predicate'

export const item_modifier = as('item_modifier', dispatch('function', resource('loot_function_type'),
	(function_) => record({
		...pick(function_, {
			apply_bonus: {
				enchantment: resource('enchantment'),
				formula: string, // TODO
				parameters: opt(record({
					bonusMultiplier: opt(float),
					extra: opt(float),
					probability: opt(floatRange(0, 1)),
				})), // TODO
			},
			copy_name: {
				source: string, // TODO
			},
			copy_nbt: {
				source: string, // TODO
				ops: listOf(record({
					source: string, // TODO
					target: string, // TODO
					op: string, // TODO
				})),
			},
			copy_state: {
				block: resource('block'),
				properties: listOf(string), // TODO
			},
			enchant_randomly: {
				enchantments: opt(listOf(resource('enchantment'))),
			},
			enchant_with_levels: {
				levels: int_range,
				treasure: opt(boolean),
			},
			exploration_map: {
				destination: opt(resource('worldgen/structure_feature')),
				decoration: opt(string), // TODO
				zoom: opt(int),
				search_radius: opt(int),
				skip_existing_chunks: opt(boolean),
			},
			fill_player_head: {
				entity: string, // TODO
			},
			limit_count: {
				limit: int_bounds,
			},
			looting_enchant: {
				count: int_bounds,
				limit: opt(int),
			},
			set_attributes: {
				modifiers: listOf(record({
					attribute: resource('attribute'),
					name: string,
					id: opt(string), // TODO
					amount: int_range,
					slot: any([
						string,
						listOf(string),
					]), // TODO
				})),
			},
			set_contents: {
				entries: listOf(loot_entry),
			},
			set_count: {
				count: int_range,
			},
			set_damage: {
				damage: as('range', record({
					min: floatRange(0, 1),
					max: floatRange(0, 1),
				})),
			},
			set_loot_table: {
				name: resource('loot_table'),
				seed: opt(int),
			},
			set_lore: {
				entity: opt(string), // TODO
				lore: listOf(string), // TODO
				replace: opt(boolean),
			},
			set_name: {
				entity: string, // TODO
				name: opt(string), // TODO
			},
			set_stew_effect: {
				effects: opt(listOf(record({
					type: resource('mob_effect'),
					duration: int_range,
				}))),
			},
		}),
		conditions: opt(listOf(predicate)),
	})
))

export const item_modifier_extended = any([
	item_modifier,
	listOf(item_modifier),
])
