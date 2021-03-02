import { any, as, floatRange, int, opt, record, string } from '../primitives'

export const int_range = as('range', any([
	int,
	record({
		min: int,
		max: int,
	}),
	record({
		type: string,
		n: int,
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
