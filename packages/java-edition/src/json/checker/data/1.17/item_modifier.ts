import { any, as, boolean, dispatch, extract, float, floatRange, int, listOf, literal, opt, pick, record, resource, simpleString } from '@spyglassmc/json/lib/checker/primitives'
import { blockStateList, nbt, uuid } from '../../util'
import { int_bounds, number_provider } from './common'
import { loot_entry } from './loot_table'
import { predicate } from './predicate'
import { text_component } from './text_component'

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
				treasure: opt(boolean),
			},
			exploration_map: {
				destination: opt(resource('worldgen/structure_feature')),
				decoration: opt(literal(map_decorations)),
				zoom: opt(int),
				search_radius: opt(int),
				skip_existing_chunks: opt(boolean),
			},
			fill_player_head: {
				entity: literal(['this', 'killer', 'killer_player',  'direct_killer']),
			},
			limit_count: {
				limit: int_bounds,
			},
			looting_enchant: {
				count: number_provider,
				limit: opt(int),
			},
			set_attributes: {
				modifiers: listOf(record({
					attribute: resource('attribute'),
					name: simpleString,
					id: opt(uuid),
					amount: number_provider,
					slot: any([
						literal(slots),
						listOf(literal(slots)),
					]),
				})),
			},
			set_contents: {
				entries: listOf(loot_entry),
			},
			set_count: {
				count: number_provider,
				add: opt(boolean),
			},
			set_damage: {
				damage: number_provider,
				add: opt(boolean),
			},
			set_loot_table: {
				name: resource('loot_table'),
				seed: opt(int),
			},
			set_lore: {
				entity: opt(literal(['this', 'killer', 'killer_player',  'direct_killer'])),
				lore: listOf(text_component),
				replace: opt(boolean),
			},
			set_name: {
				entity: opt(literal(['this', 'killer', 'killer_player',  'direct_killer'])),
				name: opt(text_component),
			},
			set_nbt: {
				tag: nbt(), // TODO: item nbt
			},
			set_stew_effect: {
				effects: opt(listOf(record({
					type: resource('mob_effect'),
					duration: number_provider,
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

const slots = [
	'mainhand',
	'offhand',
	'head',
	'chest',
	'legs',
	'feet',
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
