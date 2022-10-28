import { ErrorSeverity } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonArrayExpectation, JsonNode } from '../../node/index.js'
import { JsonArrayNode, JsonStringNode } from '../../node/index.js'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker.js'
import { expectation } from './util.js'

export function listOf(checker: JsonChecker): JsonChecker {
	return (node, ctx) => {
		node.expectation = [{ type: 'json:array', typedoc: 'Array' }]
		if (!ctx.depth || ctx.depth <= 0) {
			;(node.expectation![0] as JsonArrayExpectation).items = expectation(
				checker,
				ctx,
			)
		}

		if (!JsonArrayNode.is(node)) {
			ctx.err.report(localize('expected', localize('array')), node)
		} else {
			node.children
				.filter((e) => e.value)
				.forEach((e) => checker(e.value!, ctx))
		}
	}
}

type UniqueListOptions = {
	items?: (node: JsonNode) => [string | undefined, JsonNode]
	report?: (node: JsonNode, ctx: JsonCheckerContext) => unknown
}
export function uniqueListOf(
	checker: JsonChecker,
	options: UniqueListOptions = {},
): JsonChecker {
	const getItem =
		options.items ??
		((node) => [JsonStringNode.is(node) ? node.value : undefined, node])
	const reporter =
		options.report ??
		((node, ctx) =>
			ctx.err.report(
				localize('json.checker.item.duplicate'),
				node,
				ErrorSeverity.Warning,
			))
	return (node, ctx) => {
		listOf(checker)(node, ctx)
		if (JsonArrayNode.is(node)) {
			const items = new Map<string, JsonNode>()
			const duplicates = new Set<JsonNode>()
			node.children.forEach((c) => {
				if (!c.value) return
				const [value, item] = getItem(c.value)
				if (!value) return
				const existing = items.get(value)
				if (existing) {
					duplicates.add(existing)
					duplicates.add(item)
				}
				items.set(value, item)
			})
			duplicates.forEach((node) => reporter(node, ctx))
		}
	}
}
