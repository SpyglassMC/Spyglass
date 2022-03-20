import * as core from '@spyglassmc/core'
import { any, boolean, intRange, listOf, literal, object, opt, record, simpleString } from '@spyglassmc/json/lib/checker'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { getTagValues } from '../../../common'

interface Options {
	category?: 'block' | 'fluid',
	id?: string | undefined,
	ids?: readonly string[] | undefined,
	tag?: string | undefined,
	mixedTypes?: boolean,
	requireAll?: boolean,
}

export function blockStateMap({ category, id, ids, tag, mixedTypes, requireAll }: Options): JsonChecker {
	return (node, ctx) => {
		if (tag) {
			ids = getTagValues(`tag/${category ?? 'block'}`, tag, ctx)
		} else if (id) {
			ids = [id]
		}
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ids?.length || !ctx.ensureChecked) {
			const values = mixedTypes ? any([boolean, simpleString, intBounds()]) : simpleString
			object(
				simpleString,
				() => requireAll ? values : opt(values)
			)(node, ctx)
			return
		}
		const states = core.getStates(category ?? 'block', ids, ctx)
		object(
			Object.keys(states),
			(state) => {
				const values = states[state] ?? []
				const checkers: JsonChecker[] = [literal(values)]
				if (mixedTypes && values.length) {
					if (['true', 'false'].includes(values[0])) {
						checkers.push(boolean)
					} else if (values[0].match(/^\d+$/)) {
						checkers.push(intBounds(parseInt(values[0]), parseInt(values[values.length - 1])))
					}
				}
				const checker = checkers.length > 1 ? any(checkers) : checkers[0]
				return requireAll ? checker : opt(checker)
			},
		)(node, ctx)
	}
}

export function blockStateList({ category, id, ids, tag }: Options): JsonChecker {
	return (node, ctx) => {
		if (tag) {
			ids = getTagValues(`tag/${category ?? 'block'}`, tag, ctx)
		} else if (id) {
			ids = [id]
		}
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ids?.length || !ctx.ensureChecked) {
			listOf(simpleString)(node, ctx)
			return
		}
		const states = core.getStates(category ?? 'block', ids, ctx)
		listOf(literal(Object.keys(states)))(node, ctx)
	}
}

function intBounds(min: number | undefined = undefined, max: number | undefined = undefined): JsonChecker {
	return any([
		intRange(min, max),
		record({
			min: opt(intRange(min, max)),
			max: opt(intRange(min, max)),
		}),
	])
}
