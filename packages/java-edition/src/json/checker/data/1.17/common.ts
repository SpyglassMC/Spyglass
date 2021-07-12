import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { any, as, dispatch, extract, float, floatRange, int, intRange, literal, opt, pick, record, ref, resource, simpleString } from '@spyglassmc/json/lib/checker/primitives'
import { blockStateMap } from '../../util'

function smallestEncompassingPowerOfTwo(n: number) {
	n = n - 1
	n |= n >> 1
	n |= n >> 2
	n |= n >> 4
	n |= n >> 8
	n |= n >> 16
	return n + 1
}

const BITS_FOR_Y = 64 - 2 * (1 + Math.log2(smallestEncompassingPowerOfTwo(30000000))) // 12
export const Y_SIZE = (1 << BITS_FOR_Y) - 32 // 4064
export const MAX_Y = (Y_SIZE >> 1) - 1 // 2031
export const MIN_Y = MAX_Y - Y_SIZE + 1 // -2031

export const number_provider = as('range', any([
	float,
	dispatch('type', (type) => record({
		type: opt(resource('loot_number_provider_type')),
		...type === undefined ? {
			min: number_provider,
			max: number_provider,
		} : {},
		...pick(type, {
			constant: {
				value: float,
			},
			uniform: {
				min: number_provider,
				max: number_provider,
			},
			binomial: {
				n: number_provider,
				p: number_provider,
			},
			score: {
				target: score_provider,
				score: literal('objective'),
				scale: opt(float),
			},
		}),
	})),
]))

export const score_provider = any([
	literal(['this', 'killer', 'player_killer', 'direct_killer']),
	dispatch('type', (type) => record({
		type: resource('loot_score_provider_type'),
		...pick(type, {
			context: {
				target: literal(['this', 'killer', 'player_killer', 'direct_killer']),
			},
			fixed: {
				name: simpleString, // TODO: score holder, no selector
			},
		}),
	})),
])

export const int_bounds = as('bounds', any([
	int,
	any([
		record({
			min: int,
			max: opt(int),
		}),
		record({
			min: opt(int),
			max: int,
		}),
	]),
]))

export const float_bounds = as('bounds', any([
	float,
	any([
		record({
			min: float,
			max: opt(float),
		}),
		record({
			min: opt(float),
			max: float,
		}),
	]),
]))

export const block_state = as('block_state', dispatch(props => record({
	Name: resource('block'),
	Properties: opt(blockStateMap({
		id: extract('Name', props),
		requireAll: true,
	})),
})))

export const fluid_state = as('fluid_state', dispatch(props => record({
	Name: resource('fluid'),
	Properties: opt(blockStateMap({
		id: extract('Name', props),
		category: 'fluid',
		requireAll: true,
	})),
})))

export const vertical_anchor = as('vertical_anchor', any([
	record({
		absolute: intRange(MIN_Y, MAX_Y),
	}),
	record({
		above_bottom: intRange(MIN_Y, MAX_Y),
	}),
	record({
		below_top: intRange(MIN_Y, MAX_Y),
	}),
]))

export const height_provider = as('height_provider', any([
	vertical_anchor,
	dispatch('type', type => record({
		type: resource('height_provider_type'),
		...pick(type, {
			constant: {
				value: vertical_anchor,
			},
			uniform: {
				min_inclusive: vertical_anchor,
				max_inclusive: vertical_anchor,
			},
			biased_to_bottom: {
				min_inclusive: vertical_anchor,
				max_inclusive: vertical_anchor,
				inner: opt(intRange(1, undefined), 1),
			},
			very_biased_to_bottom: {
				min_inclusive: vertical_anchor,
				max_inclusive: vertical_anchor,
				inner: opt(intRange(1, undefined), 1),
			},
			trapezoid: {
				min_inclusive: vertical_anchor,
				max_inclusive: vertical_anchor,
				plateau: opt(int, 0),
			},
		}),
	})),
]))

export const floatProvider = (min: number | undefined = undefined, max: number | undefined = undefined) => as('float_provider', any([
	floatRange(min, max),
	dispatch('type', type => record({
		type: resource('float_provider_type'),
		...pick(type, {
			constant: {
				value: floatRange(min, max),
			},
			uniform: {
				value: record({
					min_inclusive: floatRange(min, max),
					max_exclusive: floatRange(min, max),
				}),
			},
			clamped_normal: {
				value: record({
					mean: float,
					deviation: float,
					min: floatRange(min, max),
					max: floatRange(min, max),
				}),
			},
			trapezoid: {
				value: record({
					min: floatRange(min, max),
					max: floatRange(min, max),
					plateau: float,
				}),
			},
		}),
	})),
]))

export const intProvider = (min: number | undefined = undefined, max: number | undefined = undefined): JsonChecker => as('int_provider', any([
	intRange(min, max),
	dispatch('type', type => record({
		type: resource('int_provider_type'),
		...pick(type, {
			constant: {
				value: intRange(min, max),
			},
			uniform: {
				value: record({
					min_inclusive: intRange(min, max),
					max_inclusive: intRange(min, max),
				}),
			},
			biased_to_bottom: {
				value: record({
					min_inclusive: intRange(min, max),
					max_inclusive: intRange(min, max),
				}),
			},
			clamped: {
				value: record({
					min_inclusive: intRange(min, max),
					max_inclusive: intRange(min, max),
					source: ref(() => intProvider()),
				}),
			},
		}),
	})),
]))

export const HeightmapType = [
	'MOTION_BLOCKING',
	'MOTION_BLOCKING_NO_LEAVES',
	'OCEAN_FLOOR',
	'OCEAN_FLOOR_WG',
	'WORLD_SURFACE',
	'WORLD_SURFACE_WG',
]

export const Slots = [
	'mainhand',
	'offhand',
	'head',
	'chest',
	'legs',
	'feet',
]
