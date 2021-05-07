import { any, as, boolean, dispatch, float, floatRange, intRange, listOf, literal, opt, pick, record, resource, simpleString, when } from '@spyglassmc/json/lib/checker'
import { nbt } from '../../util'
import { block_state, HeightmapType } from './common'
import { configured_feature_ref } from './feature'

export const rule_test = as('rule_test', dispatch('predicate_type', type => record({
	predicate_type: resource('rule_test'),
	...pick(type, {
		block_match: {
			block: resource('block'),
		},
		blockstate_match: {
			block_state: block_state,
		},
		random_block_match: {
			block: resource('block'),
			probability: floatRange(0, 1),
		},
		random_blockstate_match: {
			block_state: block_state,
			probability: floatRange(0, 1),
		},
		tag_match: {
			tag: resource('tag/block'),
		},
	}),
})))

export const pos_rule_test = as('pos_rule_test', dispatch('predicate_type', type => record({
	predicate_type: resource('pos_rule_test'),
	...pick(type, {
		axis_aligned_linear_pos: {
			axis: literal(['x', 'y', 'z']),
			min_dist: intRange(0, 255),
			max_dist: intRange(0, 255),
			min_chance: floatRange(0, 1),
			max_chance: floatRange(0, 1),
		},
	}),
	...when(type, ['axis_aligned_linear_pos', 'linear_pos'], {
	}),
})))

const processor_rule = as('processor_rule', record({
	position_predicate: opt(pos_rule_test),
	input_predicate: rule_test,
	location_predicate: rule_test,
	output_state: block_state,
	output_nbt: opt(nbt()),
}))

const processor = as('processor', dispatch('processor_type', type => record({
	processor_type: resource('worldgen/structure_processor'),
	...pick(type, {
		block_age: {
			mossiness: float,
		},
		block_ignore: {
			blocks: listOf(block_state),
		},
		block_rot: {
			integrity: floatRange(0, 1),
		},
		gravity: {
			heightmap: literal(HeightmapType),
		},
		rule: {
			rules: listOf(processor_rule),
		},
	}),
})))

export const processor_list = as('processor_list', any([
	record({
		processors: listOf(processor),
	}),
	listOf(processor),
]))

export const processor_list_ref = as('processor_list', any([
	resource('worldgen/processor_list'),
	processor_list,
]))

const template_element = as('template_element', dispatch('element_type', type => record({
	element_type: resource('worldgen/structure_pool_element'),
	projection: literal(['rigid', 'terrain_matching']),
	...pick(type, {
		feature_pool_element: {
			feature: configured_feature_ref,
		},
		legacy_single_pool_element: {
			location: resource('structure'),
			processors: processor_list_ref,
		},
		list_pool_element: {
			elements: listOf(template_element),
		},
		single_pool_element: {
			location: resource('structure'),
			processors: processor_list_ref,
		},
	}),
})))

export const template_pool = as('template_pool', record({
	name: simpleString,
	fallback: resource('worldgen/template_pool'),
	elements: listOf(record({
		weight: intRange(1, null),
		element: template_element,
	})),
}))

export const template_pool_ref = any([
	resource('worldgen/template_pool'),
	template_pool,
])

export const configured_structure_feature = as('structure_feature', dispatch('type', type => record({
	type: resource('worldgen/structure_feature'),
	config: record({
		...when(type, ['bastion_remnant', 'pillager_outpost', 'village'], {
			start_pool: template_pool_ref,
			size: intRange(0, 7),
		}, pick(type, {
			buried_treasure: {
				probability: floatRange(0, 1),
			},
			mineshaft: {
				type: literal(['normal', 'mesa']),
				probability: floatRange(0, 1),
			},
			ocean_ruin: {
				biome_temp: literal(['cold', 'warm']),
				large_probability: floatRange(0, 1),
				cluster_probability: floatRange(0, 1),
			},
			ruined_portal: {
				portal_type: literal(['standard', 'desert', 'jungle', 'mountain', 'nether', 'ocean', 'swamp']),
			},
			shipwreck: {
				is_beached: opt(boolean),
			},
		})),
	}),
})))
