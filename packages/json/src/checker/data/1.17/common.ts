import { any, as, dispatch, float, int, literal, opt, pick, record, resource, simpleString } from '../../primitives'

export const number_provider = as('range', any([
	float,
	dispatch('type', (type) => record({
		type: resource('loot_number_provider_type'),
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
