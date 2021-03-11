import { any, as, float, floatRange, int, opt, record, resource } from '../primitives'

export const int_range = as('range', any([
	int,
	record({
		type: opt(resource(['uniform'])),
		min: int,
		max: int,
	}),
	record({
		type: resource(['binomial']),
		n: int,
		p: floatRange(0, 1),
	}),
]))

export const float_range = as('range', any([
	float,
	record({
		type: opt(resource(['uniform'])),
		min: float,
		max: float,
	}),
	record({
		type: resource(['binomial']),
		n: float,
		p: floatRange(0, 1),
	}),
]))

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
