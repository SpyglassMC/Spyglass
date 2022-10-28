import {
	any,
	as,
	boolean,
	dispatch,
	float,
	floatRange,
	int,
	intRange,
	listOf,
	literal,
	object,
	opt,
	pick,
	record,
	ref,
	resource,
	simpleString,
} from '@spyglassmc/json/lib/checker/primitives/index.js'
import { versioned } from '../util/index.js'
import { block_state, noise_parameters, vertical_anchor } from './common.js'

const material_condition = as(
	'material_condition',
	dispatch('type', (type) =>
		record({
			type: resource('worldgen/material_condition'),
			...pick(type, {
				biome: {
					biome_is: listOf(resource('worldgen/biome')),
				},
				noise_threshold: {
					noise: resource('worldgen/noise'),
					min_threshold: float,
					max_threshold: float,
				},
				not: {
					invert: material_condition,
				},
				stone_depth: {
					offset: int,
					surface_type: literal(['floor', 'ceiling']),
					add_surface_depth: boolean,
					add_surface_secondary_depth: boolean,
				},
				vertical_gradient: {
					random_name: simpleString,
					true_at_and_below: vertical_anchor,
					false_at_and_above: vertical_anchor,
				},
				water: {
					offset: int,
					surface_depth_multiplier: intRange(-20, 20),
					add_stone_depth: boolean,
				},
				y_above: {
					anchor: vertical_anchor,
					surface_depth_multiplier: intRange(-20, 20),
					add_stone_depth: boolean,
				},
			}),
		}),
	),
)

const material_rule = as(
	'material_rule',
	dispatch('type', (type) =>
		record({
			type: resource('worldgen/material_rule'),
			...pick(type, {
				block: {
					result_state: block_state,
				},
				condition: {
					if_true: material_condition,
					then_run: material_rule,
				},
				sequence: {
					sequence: listOf(material_rule),
				},
			}),
		}),
	),
)

const terrain_spline = as(
	'terrain_spline',
	any([
		float,
		record({
			coordinate: literal(['continents', 'erosion', 'weirdness', 'ridges']),
			points: listOf(
				record({
					location: float,
					value: ref(() => terrain_spline),
					derivative: float,
				}),
			),
		}),
	]),
)

const structure_settings = as(
	'structure_settings',
	record({
		stronghold: opt(
			record({
				distance: intRange(0, 1023),
				spread: intRange(0, 1023),
				count: intRange(1, 4095),
			}),
		),
		structures: object(resource('worldgen/structure_feature'), () =>
			record({
				spacing: intRange(0, 4096),
				separation: intRange(0, 4096), // TODO: validate separation < spacing
				salt: intRange(0, undefined),
			}),
		),
	}),
)

const noise_slide_settings = dispatch((_, ctx) =>
	record({
		target: float,
		size: versioned(ctx, int, '1.17', intRange(0, undefined)),
		offset: int,
	}),
)

export const noise_settings = as(
	'noise_settings',
	dispatch((_, ctx) =>
		record({
			bedrock_roof_position: versioned(ctx, int, '1.18'),
			bedrock_floor_position: versioned(ctx, int, '1.18'),
			sea_level: int,
			min_surface_level: versioned(ctx, '1.17', versioned(ctx, int, '1.18')),
			disable_mob_generation: boolean,
			...versioned(ctx, '1.17', {
				noise_caves_enabled: boolean,
				noodle_caves_enabled: boolean,
				aquifers_enabled: boolean,
				deepslate_enabled: versioned(ctx, boolean, '1.18'),
				ore_veins_enabled: boolean,
			}),
			legacy_random_source: versioned(ctx, '1.18', boolean),
			default_block: block_state,
			default_fluid: block_state,
			noise: record({
				min_y: versioned(ctx, '1.17', intRange(-2048, 2047)), // TODO: validate
				height: intRange(0, 4096),
				size_horizontal: intRange(1, 4),
				size_vertical: intRange(1, 4),
				density_factor: versioned(ctx, float, '1.18'),
				density_offset: versioned(ctx, float, '1.18'),
				simplex_surface_noise: versioned(ctx, boolean, '1.18'),
				random_density_offset: opt(versioned(ctx, boolean, '1.18'), false),
				island_noise_override: opt(boolean, false),
				amplified: opt(boolean, false),
				large_biomes: opt(versioned(ctx, '1.18', boolean), false),
				sampling: record({
					xz_scale: floatRange(0.001, 1000),
					y_scale: floatRange(0.001, 1000),
					xz_factor: floatRange(0.001, 1000),
					y_factor: floatRange(0.001, 1000),
				}),
				top_slide: noise_slide_settings,
				bottom_slide: noise_slide_settings,
				terrain_shaper: versioned(
					ctx,
					'1.18',
					record({
						offset: terrain_spline,
						factor: terrain_spline,
						jaggedness: terrain_spline,
					}),
				),
			}),
			surface_rule: versioned(ctx, '1.18', material_rule),
			structures: structure_settings,
		}),
	),
)

const climate_parameter = any([floatRange(-2, 2), listOf(floatRange(-2, 2))])

const biome_source = as(
	'biome_source',
	dispatch('type', (type, _, ctx) =>
		record({
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
					seed: versioned(ctx, int, '1.18'),
					preset: opt(
						versioned(
							ctx,
							literal(['nether']),
							'1.18',
							resource(['minecraft:overworld', 'minecraft:nether']),
						),
					),
					...versioned(
						ctx,
						{
							altitude_noise: noise_parameters,
							temperature_noise: noise_parameters,
							humidity_noise: noise_parameters,
							weirdness_noise: noise_parameters,
						},
						'1.18',
					),
					biomes: listOf(
						record({
							biome: resource('worldgen/biome'),
							parameters: record(
								versioned(
									ctx,
									{
										altitude: float,
										temperature: float,
										humidity: float,
										weirdness: float,
										offset: float,
									},
									'1.18',
									{
										temperature: climate_parameter,
										humidity: climate_parameter,
										continentalness: climate_parameter,
										erosion: climate_parameter,
										weirdness: climate_parameter,
										depth: climate_parameter,
										offset: floatRange(0, 1),
									},
								),
							),
						}),
					),
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
		}),
	),
)

export const dimension_type = as(
	'dimension_type',
	dispatch((_, ctx) =>
		record({
			min_y: versioned(ctx, '1.17', intRange(-2048, 2047)), // TODO: validate
			height: versioned(ctx, '1.17', intRange(0, 4096)),
			logical_height: versioned(
				ctx,
				intRange(0, 256),
				'1.17',
				intRange(0, 4096),
			),
			coordinate_scale: floatRange(0.00001, 30000000),
			ambient_light: float,
			fixed_time: opt(int),
			infiniburn: resource('tag/block'),
			effects: opt(
				resource(['overworld', 'the_nether', 'the_end']),
				'overworld',
			),
			ultrawarm: boolean,
			natural: boolean,
			piglin_safe: boolean,
			respawn_anchor_works: boolean,
			bed_works: boolean,
			has_raids: boolean,
			has_skylight: boolean,
			has_ceiling: boolean,
		}),
	),
)

export const dimension = as(
	'dimension',
	record({
		type: any([resource('dimension_type'), dimension_type]),
		generator: as(
			'chunk_generator',
			dispatch('type', (type) =>
				record({
					type: resource('worldgen/chunk_generator'),
					...pick(type, {
						flat: {
							settings: record({
								layers: listOf(
									record({
										block: resource('block'),
										height: intRange(0, 4096),
									}),
								),
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
				}),
			),
		),
	}),
)
