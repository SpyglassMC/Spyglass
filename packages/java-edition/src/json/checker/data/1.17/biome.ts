import { any, as, boolean, dispatch, float, floatRange, int, intRange, listOf, literal, object, opt, record, resource, when } from '@spyglassmc/json/lib/checker/primitives'
import { intColor } from '../../util'
import { block_state, floatProvider, height_provider, vertical_anchor } from './common'
import { configured_feature_list_ref } from './feature'
import { configured_structure_feature } from './structure'

const BiomeCategory = [
	'beach',
	'desert',
	'extreme_hills',
	'forest',
	'icy',
	'jungle',
	'mesa',
	'mushroom',
	'nether',
	'none',
	'ocean',
	'plains',
	'river',
	'savanna',
	'swamp',
	'taiga',
	'the_end',
	'underground',
]

const MobCategory = [
	'monster',
	'creature',
	'ambient',
	'water_creature',
	'water_ambient',
	'underground_water_creature',
	'misc',
]

export const configured_surface_builder = as('surface_builder', record({
	type: resource('worldgen/surface_builder'),
	config: record({
		top_material: block_state,
		under_material: block_state,
		underwater_material: block_state,
	}),
}))

export const configured_carver = as('carver', dispatch('type', type => record({
	type: resource('worldgen/carver'),
	config: record({
		probability: floatRange(0, 1),
		y: height_provider,
		yScale: floatProvider(),
		lava_level: vertical_anchor,
		aquifers_enabled: boolean,
		debug_settings: opt(record({
			debug_mode: opt(boolean),
			air_state: opt(block_state),
			water_state: opt(block_state),
			lava_state: opt(block_state),
			barrier_state: opt(block_state),
		})),
		...when(type, ['cave', 'nether_cave', 'underwater_cave'], {
			horizontal_radius_multiplier: floatProvider(),
			vertical_radius_multiplier: floatProvider(),
			floor_level: floatProvider(-1, 1),
		}),
		...when(type, ['canyon', 'underwater_canyon'], {
			vertical_rotation: floatProvider(),
			shape: record({
				distance_factor: floatProvider(),
				thickness: floatProvider(),
				width_smoothness: intRange(0, null),
				horizontal_radius_factor: floatProvider(),
				vertical_radius_default_factor: float,
				vertical_radius_center_factor: float,
			}),
		}),
	}),
})))

export const biome = as('biome', record({
	depth: float,
	scale: float,
	downfall: float,
	temperature: float,
	temperature_modifier: opt(literal(['none', 'frozen'])),
	precipitation: literal(['none', 'rain', 'snow']),
	category: literal(BiomeCategory),
	effects: record({
		sky_color: intColor(),
		fog_color: intColor(),
		water_color: intColor(),
		water_fog_color: intColor(),
		grass_color: opt(intColor()),
		foliage_color: opt(intColor()),
		grass_color_modifier: opt(literal(['none', 'dark_forest', 'swamp'])),
		particle: opt(record({
			options: record({
				type: resource('particle_type'),
			}),
			probability: floatRange(0, 1),
		})),
		ambient_sound: opt(resource('sound_event')),
		mood_sound: opt(record({
			sound: resource('sound_event'),
			tick_delay: int,
			block_search_extent: int,
			offset: float,
		})),
		additions_sound: opt(record({
			sound: resource('sound_event'),
			tick_chance: floatRange(0, 1),
		})),
		music: opt(record({
			sound: resource('sound_event'),
			min_delay: int,
			max_delay: int,
			replace_current_music: boolean,
		})),
	}),
	player_spawn_friendly: opt(boolean),
	creature_spawn_probability: opt(floatRange(0, 0.9999999)),
	spawners: object(
		literal(MobCategory),
		() => listOf(record({
			type: resource('entity_type'),
			weight: int,
			minCount: int,
			maxCount: int,
		}))
	),
	spawn_costs: object(
		resource('entity_type'),
		() => record({
			energy_budget: float,
			charge: float,
		})
	),
	surface_builder: any([
		resource('worldgen/configured_surface_builder'),
		configured_surface_builder,
	]),
	carvers: object(
		['air', 'liquid'],
		() => opt(any([
			listOf(resource('worldgen/configured_carver')),
			listOf(configured_carver),
		]))
	),
	starts: any([
		listOf(resource('worldgen/configured_structure_feature')),
		listOf(configured_structure_feature),
	]),
	features: listOf(configured_feature_list_ref),
}))
