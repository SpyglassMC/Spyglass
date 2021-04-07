import { localize } from '@spyglassmc/locales'
import type { JsonArrayExpectation, JsonNode } from '../../node'
import { JsonArrayNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'
import { expectation } from './util'

export function listOf(checker: JsonChecker): JsonChecker {
	return async (node: JsonNode, ctx: JsonCheckerContext) => {
		node.expectation = [{ type: 'json:array', typedoc: 'Array' }]
		if (!ctx.depth || ctx.depth <= 0) {
			(node.expectation[0] as JsonArrayExpectation).items = expectation(checker, ctx)
		}

		if (!JsonArrayNode.is(node)) {
			ctx.err.report(localize('expected', localize('array')), node)
		} else {
			node.children.filter(e => e.value)
				.forEach(e => checker(e.value!, ctx))
		}
	}
}
