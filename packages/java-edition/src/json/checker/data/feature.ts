import type { Symbol } from '@spyglassmc/core'
import type { JsonNode } from '@spyglassmc/json'
import { JsonArrayNode, JsonObjectNode } from '@spyglassmc/json'
import type { JsonCheckerContext } from '@spyglassmc/json/lib/checker'
import { any, as, boolean, dispatch, extract, float, floatRange, int, intRange, listOf, literal, opt, pick, record, ref, resource, simpleString } from '@spyglassmc/json/lib/checker/primitives'
import { block_state, floatProvider, fluid_state, HeightmapType, height_provider, intProvider, Y_SIZE } from './common'
import { processor_list_ref, rule_test } from './structure'

function blockStateIntProperties(node: JsonNode | undefined, ctx: JsonCheckerContext) {
	if (node && JsonObjectNode.is(node)) {
		let block = extract('Name', node.children)
		if (block) {
			if (!block.startsWith('minecraft:')) {
				block = `minecraft:${block}`
			}
			return Object.values(ctx.symbols.query(ctx.doc, 'block', block).symbol?.members ?? {})
				.filter((m): m is Symbol => m?.subcategory === 'state')
				.filter(m => Object.keys(m.members ?? {})[0]?.match(/^\d+$/))
				.map(m => m.identifier)
		}
	}
	return []
}

function blockProviderProperties(node: JsonNode | undefined, ctx: JsonCheckerContext): string[] {
	if (!node || !JsonObjectNode.is(node)) return []
	switch (extract('type', node.children)?.replace(/^minecraft:/, '')) {
		case 'randomized_int_state_provider':
			const source = node.children.find(p => p.key?.value === 'source')?.value
			return blockProviderProperties(source, ctx)
		case 'rotated_block_provider':
		case 'simple_state_provider':
			const state = node.children.find(p => p.key?.value === 'state')?.value
			return blockStateIntProperties(state, ctx)
		case 'weighted_state_provider':
			const entries = node.children.find(p => p.key?.value === 'entries')?.value
			if (entries && JsonArrayNode.is(entries)) {
				const values = entries.children
					.map(n => n.value && JsonObjectNode.is(n.value) &&
						n.value.children.find(p => p.key?.value === 'data')?.value)
					.filter(n => n)
					.map(n => blockStateIntProperties(n as JsonNode, ctx))
				return [...new Set(([] as string[]).concat(...values).filter(e => values.every(a => a.includes(e))))]
			}
	}
	return []
}

const block_state_provider = as('block_state_provider', dispatch('type', (type, props, ctx) => record({
	type: resource('worldgen/block_state_provider_type'),
	...pick(type, {
		randomized_int_state_provider: {
			// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
			property: (ctx.ensureChecked) ? literal(blockProviderProperties(props.find(p => p.key?.value === 'source')?.value, ctx)) : simpleString,
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
				weight: intRange(1, undefined),
				data: block_state,
			})),
		},
	}),
})))

const block_placer = as('block_placer', dispatch('type', type => record({
	type: resource('worldgen/block_placer_type'),
	...pick(type, {
		column_placer: {
			size: intProvider(0, undefined),
		},
	}),
})))

const feature_size = as('feature_size', dispatch('type', type => record({
	type: resource('worldgen/feature_size_type'),
	min_clipped_height: opt(intRange(0, 80)),
	...pick(type, {
		two_layers_feature_size: {
			limit: opt(intRange(0, 81), 1),
			lower_size: opt(intRange(0, 16), 0),
			upper_size: opt(intRange(0, 16), 1),
		},
		three_layers_feature_size: {
			limit: opt(intRange(0, 81), 1),
			upper_limit: opt(intRange(0, 80), 1),
			lower_size: opt(intRange(0, 16), 0),
			middle_size: opt(intRange(0, 16), 1),
			upper_size: opt(intRange(0, 16), 1),
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
			min_height_for_leaves: opt(intRange(1, undefined), 1),
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
	tries: opt(intRange(1, undefined), 128),
	xspread: opt(intRange(0, undefined), 7),
	yspread: opt(intRange(0, undefined), 3),
	zspread: opt(intRange(0, undefined), 7),
	can_replace: opt(boolean, false),
	project: opt(boolean, true),
	need_water: opt(boolean, false),
}

const HugeMushroomConfig = {
	foliage_radius: opt(int, 2),
	cap_provider: block_state_provider,
	stem_provider: block_state_provider,
}

const OreConfig = {
	size: intRange(0, 64),
	discard_chance_on_air_exposure: floatRange(0, 1),
	targets: listOf(record({
		state: block_state,
		target: rule_test,
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
			noise_offset: opt(float, 0),
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
			crystal_invulnerable: opt(boolean, false),
			crystal_beam_target: opt(listOf(int)),
			spikes: listOf(record({
				centerX: opt(int, 0),
				centerZ: opt(int, 0),
				radius: opt(int, 0),
				height: opt(int, 0),
				guarded: opt(boolean, false),
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
			fossil_processors: processor_list_ref,
			overlay_processors: processor_list_ref,
		},
		geode: {
			blocks: record({
				filling_provider: block_state_provider,
				inner_layer_provider: block_state_provider,
				alternate_inner_layer_provider: block_state_provider,
				middle_layer_provider: block_state_provider,
				outer_layer_provider: block_state_provider,
				inner_placements: listOf(block_state),
				cannot_replace: resource('tag/block'),
				invalid_blocks: resource('tag/block'),
			}),
			layers: record({
				filling: opt(floatRange(0.01, 50), 1.7),
				inner_layer: opt(floatRange(0.01, 50), 2.2),
				middle_layer: opt(floatRange(0.01, 50), 3.2),
				outer_layer: opt(floatRange(0.01, 50), 4.2),
			}),
			crack: record({
				generate_crack_chance: opt(floatRange(0, 1), 1),
				base_crack_size: opt(floatRange(0, 5), 2),
				crack_point_offset: opt(intRange(0, 10), 2),
			}),
			noise_multiplier: opt(floatRange(0, 1), 0.05),
			use_potential_placements_chance: opt(floatRange(0, 1), 0.35),
			use_alternate_layer0_chance: opt(floatRange(0, 1), 0),
			placements_require_layer0_alternate: opt(boolean, true),
			outer_wall_distance: opt(intProvider(0, 10), { value: { min_inclusive: 0, max_inclusive: 10 } }),
			distribution_points: opt(intProvider(1, 20), { value: { min_inclusive: 3, max_inclusive: 4 } }),
			point_offset: opt(intProvider(0, 10), { value: { min_inclusive: 1, max_inclusive: 2 } }),
			min_gen_offset: opt(int, -16),
			max_gen_offset: opt(int, 16),
			invalid_blocks_threshold: int,
		},
		glow_lichen: {
			search_range: opt(intRange(1, 64), 10),
			chance_of_spreading: opt(floatRange(0, 1), 0.5),
			can_place_on_floor: opt(boolean, false),
			can_place_on_wall: opt(boolean, false),
			can_place_on_ceiling: opt(boolean, false),
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
			planted: opt(boolean, false),
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
			floor_to_ceiling_search_range: opt(intRange(1, 512), 30),
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
			radius: intProvider(0, 12),
			state: block_state,
			target: block_state,
		},
		no_bonemeal_flower: RandomPatchConfig,
		ore: OreConfig,
		random_boolean_selector: {
			feature_false: configured_feature_ref,
			feature_true: configured_feature_ref,
		},
		random_patch: RandomPatchConfig,
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
				target: rule_test,
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
			place_on: opt(listOf(block_state), []),
			place_in: opt(listOf(block_state), []),
			place_under: opt(listOf(block_state), []),
		},
		simple_random_selector: {
			features: configured_feature_list_ref,
		},
		small_dripstone: {
			max_placements: opt(intRange(0, 100), 5),
			empty_space_search_radius: opt(intRange(0, 20), 10),
			max_offset_from_origin: opt(intRange(0, 20), 2),
			chance_of_taller_dripstone: opt(floatRange(0, 1), 0.2),
		},
		spring_feature: {
			requires_block_below: opt(boolean, true),
			rock_count: opt(int, 4),
			hole_count: opt(int, 1),
			state: fluid_state,
			valid_blocks: listOf(resource('block')),
		},
		tree: {
			ignore_vines: opt(boolean, false),
			force_dirt: opt(boolean, false),
			minimum_size: feature_size,
			dirt_provider: block_state_provider,
			sapling_provider: block_state_provider,
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
