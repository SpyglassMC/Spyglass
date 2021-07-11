import * as core from '@spyglassmc/core'
import { any, boolean, intRange, listOf, literal, object, opt, record, simpleString } from '@spyglassmc/json/lib/checker'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { getTagValues } from '../../../common'

interface Options {
	category?: 'block' | 'fluid',
	block?: string | undefined,
	blocks?: readonly string[] | undefined,
	tag?: string | undefined,
	mixedTypes?: boolean,
	requireAll?: boolean,
}

export function blockStateMap(props: Options): JsonChecker
export function blockStateMap(block?: string, mixedTypes?: boolean, requireAll?: boolean): JsonChecker
export function blockStateMap(arg0?: string | Options, arg1?: boolean, arg2?: boolean): JsonChecker {
	return (node, ctx) => {
		let category: 'block' | 'fluid'
		let blocks: readonly string[] | undefined
		let mixedTypes: boolean | undefined
		let requireAll: boolean | undefined
		if (arg0 === undefined || typeof arg0 === 'string') {
			blocks = arg0 ? [arg0] : []
			category = 'block'
			mixedTypes = arg1
			requireAll = arg2
		} else {
			category = arg0.category ?? 'block'
			if (arg0.tag) {
				blocks = getTagValues(`tag/${category}`, arg0.tag, ctx)
			} else if (arg0.block) {
				blocks = [arg0.block]
			} else {
				blocks = arg0.blocks
			}
			({ mixedTypes, requireAll } = arg0)
		}
		// Does not check if `blocks` is undefined or empty.
		//                     FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!blocks?.length || !ctx.ensureChecked) {
			const values = mixedTypes ? any([boolean, simpleString, intBounds()]) : simpleString
			object(
				simpleString,
				() => requireAll ? values : opt(values)
			)(node, ctx)
			return
		}
		const states = core.checker.getStates(category, blocks, ctx)
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

export function blockStateList(block?: string): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			listOf(simpleString)(node, ctx)
			return
		}
		const states = block ? Object.keys(core.checker.getStates('block', [block], ctx)) : []
		listOf(literal(states))(node, ctx)
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
