import { any, as, boolean, dispatch, extract, float, floatRange, int, intRange, listOf, literal, object, opt, pick, record, resource, simpleString } from '@spyglassmc/json/lib/checker/primitives'
import { blockStateList, blockStateMap, nbt, uuid } from '../../util'
import { damage_source_predicate, entity_predicate, item_predicate, location_predicate } from './advancement'
import { int_bounds, number_provider, Slots } from './common'
import { text_component } from './text_component'

const loot_context_types = [
	'empty',
	'chest',
	'command',
	'selector',
	'fishing',
	'entity',
	'gift',
	'barter',
	'advancement_reward',
	'advancement_entity',
	'generic',
	'block',
]

const map_decorations = [
	'mansion',
	'monument',
	'player',
	'frame',
	'red_marker',
	'blue_marker',
	'target_x',
	'target_point',
	'player_off_map',
	'player_off_limits',
	'red_x',
	'banner_white',
	'banner_orange',
	'banner_magenta',
	'banner_light_blue',
	'banner_yellow',
	'banner_lime',
	'banner_pink',
	'banner_gray',
	'banner_light_gray',
	'banner_cyan',
	'banner_purple',
	'banner_blue',
	'banner_brown',
	'banner_green',
	'banner_red',
	'banner_black',
]

export const predicate = as('predicate', dispatch('condition',
	(condition, props) => record({
		condition: resource('loot_condition_type'),
		...pick(condition, {
			alternative: {
				terms: listOf(predicate),
			},
			block_state_property: {
				block: resource('block'),
				properties: blockStateMap(extract('block', props)),
			},
			damage_source_properties: {
				predicate: damage_source_predicate,
			},
			entity_properties: {
				entity: literal(['this', 'killer', 'killer_player', 'direct_killer']),
				predicate: entity_predicate,
			},
			entity_scores: {
				entity: literal(['this', 'killer', 'killer_player', 'direct_killer']),
				scores: object(
					literal('objective'),
					() => int_bounds
				),
			},
			inverted: {
				term: predicate,
			},
			killed_by_player: {
				inverse: opt(boolean, false),
			},
			location_check: {
				offsetX: opt(int, 0),
				offsetY: opt(int, 0),
				offsetZ: opt(int, 0),
				predicate: location_predicate,
			},
			match_tool: {
				predicate: item_predicate,
			},
			random_chance: {
				chance: floatRange(0, 1),
			},
			random_chance_with_looting: {
				chance: floatRange(0, 1),
				looting_multiplier: float,
			},
			reference: {
				name: resource('predicate'),
			},
			table_bonus: {
				enchantment: resource('enchantment'),
				chances: listOf(floatRange(0, 1)),
			},
			time_check: {
				value: int_bounds,
				period: opt(int),
			},
			weather_check: {
				rainding: opt(boolean),
				thundering: opt(boolean),
			},
		}),
	})
))

export const predicate_list = any([
	predicate,
	listOf(predicate),
])

export const item_modifier = as('item_modifier', dispatch('function',
	(function_, props) => record({
		function: resource('loot_function_type'),
		...pick(function_, {
			apply_bonus: {
				enchantment: resource('enchantment'),
				formula: resource(['binomial_with_bonus_count', 'ore_drops', 'uniform_bonus_count']),
				...pick(extract('formula', props), {
					binomial_with_bonus_count: {
						parameters: record({
							extra: float,
							probability: floatRange(0, 1),
						}),
					},
					uniform_bonus_count: {
						parameters: record({
							bonusMultiplier: float,
						}),
					},
				}),
			},
			copy_name: {
				source: literal(['this', 'killer', 'killer_player', 'block_entity']),
			},
			copy_nbt: {
				source: literal(['this', 'killer', 'killer_player', 'block_entity']),
				ops: listOf(record({
					source: simpleString, // TODO: nbt path
					target: simpleString, // TODO: nbt path
					op: literal(['replace', 'append', 'merge']),
				})),
			},
			copy_state: {
				block: resource('block'),
				properties: blockStateList(extract('block', props)),
			},
			enchant_randomly: {
				enchantments: opt(listOf(resource('enchantment'))),
			},
			enchant_with_levels: {
				levels: number_provider,
				treasure: opt(boolean, false),
			},
			exploration_map: {
				destination: opt(resource('worldgen/structure_feature'), 'buried_treasure'),
				decoration: opt(literal(map_decorations), 'mansion'),
				zoom: opt(int, 2),
				search_radius: opt(int, 50),
				skip_existing_chunks: opt(boolean, true),
			},
			fill_player_head: {
				entity: literal(['this', 'killer', 'killer_player', 'direct_killer']),
			},
			limit_count: {
				limit: int_bounds,
			},
			looting_enchant: {
				count: number_provider,
				limit: opt(int, 0),
			},
			set_attributes: {
				modifiers: listOf(record({
					attribute: resource('attribute'),
					name: simpleString,
					operation: literal(['addition', 'multiply_base', 'multiply_total']),
					id: opt(uuid),
					amount: number_provider,
					slot: any([
						literal(Slots),
						listOf(literal(Slots)),
					]),
				})),
			},
			set_contents: {
				entries: listOf(loot_entry),
			},
			set_count: {
				count: number_provider,
				add: opt(boolean, false),
			},
			set_damage: {
				damage: number_provider,
				add: opt(boolean, false),
			},
			set_loot_table: {
				name: resource('loot_table'),
				seed: opt(int, 0),
			},
			set_lore: {
				entity: opt(literal(['this', 'killer', 'killer_player', 'direct_killer'])),
				lore: listOf(text_component),
				replace: opt(boolean, false),
			},
			set_name: {
				entity: opt(literal(['this', 'killer', 'killer_player', 'direct_killer'])),
				name: opt(text_component),
			},
			set_nbt: {
				tag: nbt(), // TODO: item nbt
			},
			set_stew_effect: {
				effects: opt(listOf(record({
					type: resource('mob_effect'),
					duration: number_provider,
				})), []),
			},
		}),
		conditions: opt(listOf(predicate)),
	})
))

export const item_modifier_list = any([
	item_modifier,
	listOf(item_modifier),
])

export const loot_entry = as('loot_entry', dispatch('type',
	(type) => record({
		type: resource('loot_pool_entry_type'),
		weight: opt(intRange(1, undefined), 1),
		quality: opt(int, 0),
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
				expand: boolean,
			},
		}),
		functions: opt(listOf(item_modifier), []),
		conditions: opt(listOf(predicate), []),
	})
))

export const loot_pool = as('loot_pool', record({
	rolls: number_provider,
	bonus_rolls: opt(number_provider, 0),
	entries: listOf(loot_entry),
	functions: opt(listOf(item_modifier), []),
	conditions: opt(listOf(predicate), []),
}))

export const loot_table = as('loot_table', record({
	type: opt(resource(loot_context_types)),
	pools: opt(listOf(loot_pool), []),
	functions: opt(listOf(item_modifier), []),
}))
