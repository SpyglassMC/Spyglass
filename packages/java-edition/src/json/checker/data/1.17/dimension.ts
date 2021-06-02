import type { JsonChecker } from '@spyglassmc/json/lib/checker'
import { any, as, boolean, dispatch, float, floatRange, int, intRange, listOf, literal, object, opt, pick, record, resource } from '@spyglassmc/json/lib/checker/primitives'
import { block_state } from './common'

const structure_settings = as('structure_settings', record({
	stronghold: opt(record({
		distance: intRange(0, 1023),
		spread: intRange(0, 1023),
		count: intRange(1, 4095),
	})),
	structures: object(
		resource('worldgen/structure_feature'),
		() => record({
			spacing: intRange(0, 4096),
			separation: intRange(0, 4096), // TODO: validate separation < spacing
			salt: intRange(0, null),
		})
	),
}))

const noise_slide_settings = record({
	target: int,
	size: intRange(0, null),
	offset: int,
})

export const noise_settings: JsonChecker = (node, ctx) => as('noise_settings', record({
	...ctx.context && { name : resource('worldgen/noise_settings')},
	bedrock_roof_position: int,
	bedrock_floor_position: int,
	sea_level: int,
	min_surface_level: int,
	disable_mob_generation: boolean,
	aquifers_enabled: boolean,
	noise_caves_enabled: boolean,
	deepslate_enabled: boolean,
	ore_veins_enabled: boolean,
	noodle_caves_enabled: boolean,
	default_block: block_state,
	default_fluid: block_state,
	noise: record({
		min_y: intRange(-2048, 2047), // TODO: validate
		height: intRange(0, 4096),
		size_horizontal: intRange(1, 4),
		size_vertical: intRange(1, 4),
		density_factor: float,
		density_offset: float,
		simplex_surface_noise: boolean,
		random_density_offset: opt(boolean, false),
		island_noise_override: opt(boolean, false),
		amplified: opt(boolean, false),
		sampling: record({
			xz_scale: floatRange(0.001, 1000),
			y_scale: floatRange(0.001, 1000),
			xz_factor: floatRange(0.001, 1000),
			y_factor: floatRange(0.001, 1000),
		}),
		top_slide: noise_slide_settings,
		bottom_slide: noise_slide_settings,
	}),
	structures: structure_settings,
}))(node, ctx)

const noise_parameters = record({
	firstOctave: int,
	amplitudes: listOf(float),
})

const biome_source = as('biome_source', dispatch('type', type => record({
	type: resource('worldgen/biome_source'),
	...pick(type, {
		checkerboard: {
			scale: opt(intRange(0, 62), 2),
			biomes: listOf(resource('worldgen/biome')),
		},
		fixed: {
			biome: resource('worldgen/biome'),
		},
		multi_noise: {
			seed: int,
			preset: opt(literal(['nether'])),
			altitude_noise: noise_parameters,
			temperature_noise: noise_parameters,
			humidity_noise: noise_parameters,
			weirdness_noise: noise_parameters,
			biomes: listOf(record({
				biome: resource('worldgen/biome'),
				parameters: record({
					altitude: float,
					temperature: float,
					humidity: float,
					weirdness: float,
					offset: float,
				}),
			})),
		},
		the_end: {
			seed: int,
		},
		vanilla_layered: {
			seed: int,
			large_biomes: opt(boolean, false),
			legacy_biome_init_layer: opt(boolean, false),
		},
	}),
})))

export const dimension_type: JsonChecker = (node, ctx) => as('dimension_type', record({
	...ctx.context && { name : resource('dimension_type')},
	min_y: intRange(-2048, 2047), // TODO: validate
	height: intRange(0, 4096),
	logical_height: intRange(0, 4096),
	coordinate_scale: floatRange(0.00001, 30000000),
	ambient_light: float,
	fixed_time: opt(int),
	infiniburn: resource('tag/block'),
	effects: opt(resource(['overworld', 'the_nether', 'the_end']), 'overworld'),
	ultrawarm: boolean,
	natural: boolean,
	piglin_safe: boolean,
	respawn_anchor_works: boolean,
	bed_works: boolean,
	has_raids: boolean,
	has_skylight: boolean,
	has_ceiling: boolean,
}))(node, ctx)

export const dimension = as('dimension', record({
	type: any([
		resource('dimension_type'),
		dimension_type,
	]),
	generator: as('chunk_generator', dispatch('type', type => record({
		type: resource('worldgen/chunk_generator'),
		...pick(type, {
			flat: {
				settings: record({
					layers: listOf(record({
						block: resource('block'),
						height: intRange(0, 4096),
					})),
					biome: resource('worldgen/biome'),
					lakes: opt(boolean, false),
					features: opt(boolean, false),
					structures: structure_settings,
				}),
			},
			noise: {
				seed: int,
				settings: any([
					resource('worldgen/noise_settings'),
					noise_settings,
				]),
				biome_source: biome_source,
			},
		}),
	}))),
}))
