import type { Symbol } from '@spyglassmc/core'
import type { JsonChecker, JsonCheckerContext } from '@spyglassmc/json/lib/checker/JsonChecker'
import { any, boolean, intRange, listOf, literal, object, opt, record, simpleString } from '@spyglassmc/json/lib/checker'

export function blockStateMap(block?: string, mixedTypes = false): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when service is not given.
		if (!ctx.service) {
			object(
				simpleString,
				() => mixedTypes ? any([boolean, simpleString, intBounds()]) : simpleString
			)(node, ctx)
			return
		}
		const states = block ? getStates(block, ctx) : []
		object(
			states.map(s => s.identifier),
			(state) => {
				const stateSymbol = states.find(s => s.identifier === state)
				const values = Object.values(stateSymbol?.members ?? {})
					.filter((m): m is Symbol => m?.subcategory === 'state_value')
					.map(m => m.identifier)
				if (mixedTypes && values) {
					if (['true', 'false'].includes(values[0])) {
						return opt(boolean)
					} else if (values[0].match(/^\d+$/)) {
						return opt(intBounds(parseInt(values[0]), parseInt(values[values.length - 1])))
					}
				}
				return opt(literal(values))
			},
		)(node, ctx)
	}
}

export function blockStateList(block?: string): JsonChecker {
	return (node, ctx) => {
		const states = block ? getStates(block, ctx).map(s => s.identifier) : []
		listOf(literal(states))(node, ctx)
	}
}

function getStates(block: string, ctx: JsonCheckerContext) {
	const identifier = block.startsWith('minecraft:') ? block : `minecraft:${block}`
	const symbol = ctx.symbols.query(ctx.doc, 'block', identifier).symbol
	return Object.values(symbol?.members ?? {})
		.filter((m): m is Symbol => m?.subcategory === 'state')
}

function intBounds(min: number | null = null, max: number | null = null): JsonChecker {
	return any([
		intRange(min, max),
		record({
			min: opt(intRange(min, max)),
			max: opt(intRange(min, max)),
		}),
	])
}
