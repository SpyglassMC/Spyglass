import * as core from '@spyglassmc/core'
import { any, boolean, intRange, listOf, literal, object, opt, record, simpleString } from '@spyglassmc/json/lib/checker'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import { getTagValues } from '../../../common'

interface ComplexProperty {
	block?: string | undefined,
	blocks?: readonly string[] | undefined,
	tag?: { category: core.TagFileCategory, id: string | undefined } | undefined,
	mixedTypes?: boolean,
	requireAll?: boolean,
}

export function blockStateMap(props: ComplexProperty): JsonChecker
export function blockStateMap(block?: string, mixedTypes?: boolean, requireAll?: boolean): JsonChecker
export function blockStateMap(): JsonChecker {
	return (node, ctx) => {
		let blocks: readonly string[] | undefined
		let mixedTypes: boolean | undefined
		let requireAll: boolean | undefined
		if (arguments[0] === undefined || typeof arguments[0] === 'string') {
			blocks = [arguments[0]];
			[, mixedTypes, requireAll] = arguments
		} else {
			const props = arguments[0] as ComplexProperty
			if (props.tag && props.tag.id) {
				blocks = getTagValues(props.tag.category, props.tag.id, ctx)
			} else if (props.block) {
				blocks = [props.block]
			} else {
				blocks = props.blocks
			}
			({ mixedTypes, requireAll } = props)
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
		const states = core.checker.getStates(blocks, ctx)
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
		const states = block ? Object.keys(core.checker.getStates([block], ctx)) : []
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
