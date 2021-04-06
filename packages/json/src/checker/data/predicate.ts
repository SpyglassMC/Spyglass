import { compound } from '@spyglassmc/nbt/lib/parser'
import { any, as, boolean, dispatch, float, floatRange, int, listOf, literal, object, opt, pick, record, ref, resource, special, string } from '../primitives'
import { float_bounds, int_bounds } from './common'

const slots = [
	'mainhand',
	'offhand',
	'head',
	'chest',
	'legs',
	'feet',
]

export const item_predicate = as('item', record({
	item: opt(resource('item')),
	tag: opt(resource('tag/item')),
	count: opt(int_bounds),
	durability: opt(float_bounds),
	potion: opt(resource('potion')),
	nbt: opt(special('nbt', compound)),
	enchantments: opt(listOf(record({
		enchantment: opt(resource('enchantment')),
		levels: opt(int_bounds),
	}))),
}))

export const block_predicate = as('block', record({
	block: opt(resource('block')),
	tag: opt(resource('tag/block')),
	nbt: opt(special('nbt', compound)),
	state: opt(object(
		string,
		() => any([string, int_bounds, boolean]),
	)), // TODO: block states
}))

export const fluid_predicate = as('fluid', record({
	fluid: opt(resource('fluid')),
	tag: opt(resource('tag/fluid')),
	state: opt(object(
		string,
		() => any([string, int_bounds, boolean]),
	)), // TODO: fluid states
}))

export const location_predicate = as('location', record({
	position: opt(record({
		x: opt(float_bounds),
		y: opt(float_bounds),
		z: opt(float_bounds),
	})),
	biome: opt(resource('worldgen/biome')),
	feature: opt(string), // TODO structure features
	dimension: opt(resource('dimension')),
	block: opt(block_predicate),
	fluid: opt(fluid_predicate),
	light: opt(record({
		light: int_bounds,
	})),
	smokey: opt(boolean),
}))

export const distance_predicate = as('distance', record({
	x: opt(float_bounds),
	y: opt(float_bounds),
	z: opt(float_bounds),
	absolute: opt(float_bounds),
	horizontal: opt(float_bounds),
}))

export const mob_effect_predicate = as('mob_effect', record({
	amplifier: opt(int_bounds),
	duration: opt(int_bounds),
	ambient: opt(boolean),
	visible: opt(boolean),
}))

export const statistic_predicate = as('statistic', dispatch('type',
	(stat) => record({
		type: resource('stat_type'),
		...pick(stat, {
			mined: { stat: resource('block') },
			crafted: { stat: resource('item') },
			used: { stat: resource('item') },
			broken: { stat: resource('item') },
			picked_up: { stat: resource('item') },
			dropped: { stat: resource('item') },
			killed: { stat: resource('entity_type') },
			killed_by: { stat: resource('entity_type') },
			custom: { stat: resource('custom_stat') },
		}),
		value: int_bounds,
	})
))

export const player_predicate = as('player', record({
	gamemode: opt(literal(['survival', 'adventure', 'creative', 'spectator'])),
	level: opt(int_bounds),
	advancements: opt(object(
		resource('advancement'),
		() => any([
			boolean,
			object(
				string, // TODO: advancement criteria
				() => boolean
			),
		]),
	)),
	recipes: opt(object(
		resource('recipe'),
		() => boolean,
	)),
	stats: opt(listOf(statistic_predicate)),
}))

export const entity_predicate = as('entity', record({
	type: opt(resource('entity_type', true)),
	nbt: opt(special('nbt', compound)),
	team: opt(literal('team')),
	location: opt(location_predicate),
	distance: opt(distance_predicate),
	flags: opt(record({
		is_on_fire: opt(boolean),
		is_sneaking: opt(boolean),
		is_sprinting: opt(boolean),
		is_swimming: opt(boolean),
		is_baby: opt(boolean),
	})),
	equipment: opt(object(
		literal(slots),
		() => item_predicate,
	)),
	effects: opt(object(
		string,
		() => mob_effect_predicate,
	)),
	vehicle: opt(ref(() => entity_predicate)),
	targeted_entity: opt(ref(() => entity_predicate)),
	player: opt(player_predicate),
	fishing_hook: opt(record({
		in_open_water: opt(boolean),
	})),
	catType: opt(string),
}))

export const damage_source_predicate = as('damage_source', record({
	is_explosion: opt(boolean),
	is_fire: opt(boolean),
	is_magic: opt(boolean),
	is_projectile: opt(boolean),
	is_lightning: opt(boolean),
	bypasses_armor: opt(boolean),
	bypasses_invulnerability: opt(boolean),
	bypasses_magic: opt(boolean),
	source_entity: opt(entity_predicate),
	direct_entity: opt(entity_predicate),
}))

export const damage_predicate = as('damage', record({
	dealt: opt(int_bounds),
	taken: opt(int_bounds),
	blocked: opt(boolean),
	source_entity: opt(entity_predicate),
	type: opt(damage_source_predicate),
}))

export const predicate = as('predicate', dispatch('condition',
	(condition) => record({
		condition: resource('loot_condition_type'),
		...pick(condition, {
			alternative: {
				terms: listOf(predicate),
			},
			block_state_property: {
				block: resource('block'),
				properties: object(
					string,
					() => string,
				), // TODO: block states
			},
			damage_source_properties: {
				predicate: damage_source_predicate,
			},
			entity_properties: {
				entity: literal(['this', 'killer', 'killer_player',  'direct_killer']),
				predicate: entity_predicate,
			},
			entity_scores: {
				entity: literal(['this', 'killer', 'killer_player',  'direct_killer']),
				scores: object(
					literal('objective'),
					() => int_bounds
				),
			},
			inverted: {
				term: predicate,
			},
			killed_by_player: {
				inverse: opt(boolean),
			},
			location_check: {
				offsetX: opt(int),
				offsetY: opt(int),
				offsetZ: opt(int),
				predicate:location_predicate,
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

export const predicate_extended = any([
	predicate,
	listOf(predicate),
])
