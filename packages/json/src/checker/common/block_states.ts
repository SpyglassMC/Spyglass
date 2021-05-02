import type { Symbol } from '@spyglassmc/core'
import { int_bounds } from '../data/common'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'
import { any, boolean, listOf, literal, object, opt, simpleString } from '../primitives'

export function blockStateMap(block?: string, mixedTypes = false): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when service is not given.
		if (!ctx.service) {
			object(
				simpleString,
				() => mixedTypes ? any([boolean, simpleString, int_bounds]) : simpleString
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
						return opt(int_bounds)
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
