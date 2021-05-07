import { any, as, boolean, dispatch, float, floatRange, int, intRange, listOf, literal, object, opt, pick, record, ref, resource, simpleString } from '@spyglassmc/json/lib/checker/primitives'
import { block_state, floatProvider, fluid_state, HeightmapType, height_provider, intProvider, Y_SIZE } from './common'

const block_state_provider = as('block_state_provider', dispatch('type', type => record({
	type: resource('worldgen/block_state_provider_type'),
	...pick(type, {
		randomized_int_state_provider: {
			property: simpleString,
			values: intProvider(),
			source: block_state_provider,
		},
		rotated_block_provider: {
			state: block_state,
		},
		simple_state_provider: {
			state: block_state,
		},
		weighted_state_provider: {
			entries: listOf(record({
				weight: intRange(1, null),
				data: block_state,
			})),
		},
	}),
})))

const block_placer = as('block_placer', dispatch('type', type => record({
	type: resource('worldgen/block_placer_type'),
	...pick(type, {
		column_placer: {
			size: intProvider(0, null),
		},
	}),
})))

const feature_size = as('feature_size', dispatch('type', type => record({
	type: resource('worldgen/feature_size_type'),
	min_clipped_height: opt(intRange(0, 80)),
	...pick(type, {
		two_layers_feature_size: {
			limit: opt(intRange(0, 81)),
			lower_size: opt(intRange(0, 16)),
			upper_size: opt(intRange(0, 16)),
		},
		three_layers_feature_size: {
			limit: opt(intRange(0, 81)),
			upper_limit: opt(intRange(0, 80)),
			lower_size: opt(intRange(0, 16)),
			middle_size: opt(intRange(0, 16)),
			upper_size: opt(intRange(0, 16)),
		},
	}),
})))

const trunk_placer = as('trunk_placer', dispatch('type', type => record({
	type: resource('worldgen/trunk_placer_type'),
	base_height: intRange(0, 32),
	height_rand_a: intRange(0, 24),
	height_rand_b: intRange(0, 24),
	...pick(type, {
		bending_trunk_placer: {
			bend_length: intProvider(1, 64),
			min_height_for_leaves: opt(intRange(1, null)),
		},
	}),
})))

const foliage_placer = as('foliage_placer', dispatch('type', type => record({
	type: resource('worldgen/foliage_placer_type'),
	radius: intProvider(0, 16),
	offset: intProvider(0, 16),
	...pick(type, {
		blob_foliage_placer: {
			height: intRange(0, 16),
		},
		bush_foliage_placer: {
			height: intRange(0, 16),
		},
		fancy_foliage_placer: {
			height: intRange(0, 16),
		},
		jungle_foliage_placer: {
			height: intRange(0, 16),
		},
		mega_pine_foliage_placer: {
			crown_height: intProvider(0, 24),
		},
		pine_foliage_placer: {
			height: intProvider(0, 24),
		},
		random_spread_foliage_placer: {
			foliage_height: intProvider(1, 512),
			leaf_placement_attempts: intRange(0, 256),
		},
		spruce_foliage_placer: {
			trunk_height: intProvider(0, 24),
		},
	}),
})))

const tree_decorator = as('tree_decorator', dispatch('type', type => record({
	type: resource('worldgen/tree_decorator_type'),
	...pick(type, {
		alter_ground: {
			provider: block_state_provider,
		},
		beehive: {
			probability: floatRange(0, 1),
		},
		cocoa: {
			probability: floatRange(0, 1),
		},
	}),
})))

const DiskConfig = {
	state: block_state,
	radius: intProvider(0, 8),
	half_height: intRange(0, 4),
	targets: listOf(block_state),
}

const RandomPatchConfig = {
	state_provider: block_state_provider,
	block_placer: block_placer,
	whitelist: listOf(block_state),
	blacklist: listOf(block_state),
	tries: opt(intRange(1, null)),
	xspread: opt(intRange(0, null)),
	yspread: opt(intRange(0, null)),
	zspread: opt(intRange(0, null)),
	can_replace: opt(boolean),
	project: opt(boolean),
	need_water: opt(boolean),
}

const HugeMushroomConfig = {
	foliage_radius: opt(int),
	cap_provider: block_state_provider,
	stem_provider: block_state_provider,
}

const OreConfig = {
	size: intRange(0, 64),
	discard_chance_on_air_exposure: floatRange(0, 1),
	targets: listOf(record({
		state: block_state,
		target: object(), // TODO: rule test
	})),
}

const CountConfig = {
	count: intProvider(0, 256),
}

const VegetationPatchConfig = {
	surface: literal(['floor', 'ceiling']),
	depth: intProvider(1, 128),
	vertical_range: intRange(1, 256),
	extra_bottom_block_chance: floatRange(0, 1),
	extra_edge_column_chance: floatRange(0, 1),
	vegetation_chance: floatRange(0, 1),
	xz_radius: intProvider(),
	replaceable: resource('tag/block'),
	ground_state: block_state_provider,
	vegetation_feature: ref(() => configured_feature_ref),
}

export const configured_decorator = as('decorator', dispatch('type', type => record({
	type: resource('worldgen/decorator'),
	config: record(pick(type, {
		carving_mask: {
			step: literal(['air', 'liquid']),
		},
		cave_surface: {
			surface: literal(['floor', 'ceiling']),
			floor_to_ceiling_search_range: int,
		},
		chance: {
			chance: int,
		},
		count: CountConfig,
		count_extra: {
			count: int,
			extra_chance: float,
			extra_count: int,
		},
		count_multilayer: CountConfig,
		count_noise: {
			noise_level: float,
			below_noise: int,
			above_noise: int,
		},
		count_noise_biased: {
			noise_to_count_ratio: int,
			noise_factor: float,
			noise_offset: opt(float),
		},
		decorated: {
			outer: configured_decorator,
			inner: configured_decorator,
		},
		heightmap: {
			heightmap: literal(HeightmapType),
		},
		heightmap_spread_double: {
			heightmap: literal(HeightmapType),
		},
		lava_lake: {
			chance: int,
		},
		range: {
			height: height_provider,
		},
		water_depth_threshold: {
			max_water_depth: int,
		},
	})),
})))

export const configured_feature = as('feature', dispatch('type', type => record({
	type: resource('worldgen/feature'),
	config: record(pick(type, {
		bamboo: {
			probability: floatRange(0, 1),
		},
		basalt_columns: {
			reach: intProvider(0, 3),
			height: intProvider(1, 10),
		},
		block_pile: {
			state_provider: block_state_provider,
		},
		decorated: {
			decorator: configured_decorator,
			feature: configured_feature_ref,
		},
		delta_feature: {
			contents: block_state,
			rim: block_state,
			size: intProvider(0, 16),
			rim_size: intProvider(0, 16),
		},
		disk: DiskConfig,
		dripstone_cluster: {
			floor_to_ceiling_search_range: intRange(1, 512),
			height: intProvider(0, 128),
			radius: intProvider(0, 128),
			max_stalagmite_stalactite_height_diff: intRange(0, 64),
			height_deviation: intRange(0, 64),
			dripstone_block_layer_thickness: intProvider(0, 128),
			density: floatProvider(0, 2),
			wetness: floatProvider(0, 2),
			chance_of_dripstone_column_at_max_distance_from_center: floatRange(0, 1),
			max_distance_from_edge_affecting_chance_of_dripstone_column: intRange(1, 64),
			max_distance_from_center_affecting_height_bias: intRange(1, 64),
		},
		end_gateway: {
			exit: opt(listOf(int)),
			exact: boolean,
		},
		end_spike: {
			crystal_invulnerable: opt(boolean),
			crystal_beam_target: opt(listOf(int)),
			spikes: listOf(record({
				centerX: opt(int),
				centerZ: opt(int),
				radius: opt(int),
				height: opt(int),
				guarded: opt(boolean),
			})),
		},
		fill_layer: {
			height: intRange(0, Y_SIZE),
			state: block_state,
		},
		flower: RandomPatchConfig,
		forest_rock: {
			state: block_state,
		},
		fossil: {
			max_empty_corners_allowed: intRange(0, 7),
			fossil_structures: listOf(resource('structure')),
			overlay_structures: listOf(resource('structure')),
			fossil_processors: any([
				resource('worldgen/processor_list'),
				listOf(object()), // TODO: processor list
			]),
			overlay_processors: any([
				resource('worldgen/processor_list'),
				listOf(object()), // TODO: processor list
			]),
		},
		geode: {
			blocks: record({
				filling_provider: block_state_provider,
				inner_layer_provider: block_state_provider,
				alternate_inner_layer_provider: block_state_provider,
				middle_layer_provider: block_state_provider,
				outer_layer_provider: block_state_provider,
				inner_placements: listOf(block_state),
			}),
			layers: record({
				filling: opt(floatRange(0.01, 50)),
				inner_layer: opt(floatRange(0.01, 50)),
				middle_layer: opt(floatRange(0.01, 50)),
				outer_layer: opt(floatRange(0.01, 50)),
			}),
			crack: record({
				generate_crack_chance: opt(floatRange(0, 1)),
				base_crack_size: opt(floatRange(0, 5)),
				crack_point_offset: opt(intRange(0, 10)),
			}),
			noise_multiplier: opt(floatRange(0, 1)),
			use_potential_placements_chance: opt(floatRange(0, 1)),
			use_alternate_layer0_chance: opt(floatRange(0, 1)),
			placements_require_layer0_alternate: opt(boolean),
			outer_wall_distance: opt(intProvider(0, 10)),
			distribution_points: opt(intProvider(1, 20)),
			point_offset: opt(intProvider(0, 10)),
			min_gen_offset: opt(int),
			max_gen_offset: opt(int),
			invalid_blocks_threshold: int,
		},
		glow_lichen: {
			search_range: opt(intRange(1, 64)),
			chance_of_spreading: opt(floatRange(0, 1)),
			can_place_on_floor: opt(boolean),
			can_place_on_wall: opt(boolean),
			can_place_on_ceiling: opt(boolean),
			can_be_placed_on: listOf(block_state),
		},
		growing_plant: {
			direction: literal(['up', 'down', 'north', 'east', 'south', 'west']),
			allow_water: boolean,
			height_distribution: listOf(record({
				weight: int,
				data: intProvider(),
			})),
			body_provider: block_state_provider,
			head_provider: block_state_provider,
		},
		huge_brown_mushroom: HugeMushroomConfig,
		huge_fungus: {
			planted: opt(boolean),
			hat_state: block_state,
			decor_state: block_state,
			stem_state: block_state,
			valid_base_block: block_state,
		},
		huge_red_mushroom: HugeMushroomConfig,
		ice_patch: DiskConfig,
		iceberg: {
			state: block_state,
		},
		lake: {
			state: block_state,
		},
		large_dripstone: {
			floor_to_ceiling_search_range: opt(intRange(1, 512)),
			column_radius: intProvider(0, 20),
			height_scale: floatProvider(0, 20),
			max_column_radius_to_cave_height_ratio: floatRange(0, 1),
			stalactite_bluntness: floatProvider(0.1, 10),
			stalagmite_bluntness: floatProvider(0.1, 10),
			wind_speed: floatProvider(0, 2),
			min_radius_for_wind: intRange(0, 100),
			min_bluntness_for_wind: floatRange(0, 5),
		},
		nether_forest_vegetation: {
			state_provider: block_state_provider,
		},
		netherrack_replace_blobs: {
			radius: intProvider(),
			state: block_state,
			target: block_state,
		},
		no_bonemeal_flower: RandomPatchConfig,
		ore: OreConfig,
		random_patch: RandomPatchConfig,
		random_boolean_selector: {
			feature_false: configured_feature_ref,
			feature_true: configured_feature_ref,
		},
		random_selector: {
			features: listOf(record({
				chance: floatRange(0, 1),
				feature: configured_feature_ref,
			})),
			default: configured_feature_ref,
		},
		replace_single_block: {
			targets: listOf(record({
				state: block_state,
				target: object(), // TODO: rule test
			})),
		},
		root_system: {
			required_vertical_space_for_tree: intRange(1, 64),
			root_radius: intRange(1, 64),
			root_placement_attempts: intRange(1, 256),
			root_column_max_height: intRange(1, 4096),
			hanging_root_radius: intRange(1, 64),
			hanging_roots_vertical_span: intRange(0, 16),
			hanging_root_placement_attempts: intRange(0, 256),
			allowed_vertical_water_for_tree: intRange(1, 64),
			root_replaceable: resource('tag/block'),
			root_state_provider: block_state_provider,
			hanging_root_state_provider: block_state_provider,
			feature: configured_feature_ref,
		},
		scattered_ore: OreConfig,
		sea_pickle: CountConfig,
		seagrass: {
			probability: floatRange(0, 1),
		},
		simple_block: {
			to_place: block_state_provider,
			place_on: opt(listOf(block_state)),
			place_in: opt(listOf(block_state)),
			place_under: opt(listOf(block_state)),
		},
		simple_random_selector: {
			features: configured_feature_list_ref,
		},
		small_dripstone: {
			max_placements: opt(intRange(0, 100)),
			empty_space_search_radius: opt(intRange(0, 20)),
			max_offset_from_origin: opt(intRange(0, 20)),
			chance_of_taller_dripstone: opt(floatRange(0, 1)),
		},
		spring_feature: {
			requires_block_below: opt(boolean),
			rock_count: opt(int),
			hole_count: opt(int),
			state: fluid_state,
			valid_blocks: listOf(resource('block')),
		},
		tree: {
			ignore_vines: opt(boolean),
			force_dirt: opt(boolean),
			minimum_size: feature_size,
			dirt_provider: block_state_provider,
			trunk_provider: block_state_provider,
			foliage_provider: block_state_provider,
			trunk_placer: trunk_placer,
			foliage_placer: foliage_placer,
			decorators: listOf(tree_decorator),
		},
		underwater_magma: {
			floor_search_range: intRange(0, 512),
			placement_radius_around_floor: intRange(0, 64),
			placement_probability_per_valid_position: floatRange(0, 1),
		},
		vegetation_patch: VegetationPatchConfig,
		waterlogged_vegetation_patch: VegetationPatchConfig,
	})),
})))

export const configured_feature_ref = any([
	resource('worldgen/configured_feature'),
	configured_feature,
])

export const configured_feature_list_ref = any([
	listOf(resource('worldgen/configured_feature')),
	listOf(configured_feature),
])
