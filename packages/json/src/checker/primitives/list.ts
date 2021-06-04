import { localize } from '@spyglassmc/locales'
import type { JsonArrayExpectation } from '../../node'
import { JsonArrayNode } from '../../node'
import type { JsonChecker } from '../JsonChecker'
import { expectation } from './util'

export function listOf(checker: JsonChecker): JsonChecker {
	return (node, ctx) => {
		ctx.ops.set(node, 'expectation', [{ type: 'json:array', typedoc: 'Array' }])
		if (!ctx.depth || ctx.depth <= 0) {
			ctx.ops.set((node.expectation![0] as JsonArrayExpectation), 'items', expectation(checker, ctx))
		}

		if (!JsonArrayNode.is(node)) {
			ctx.err.report(localize('expected', localize('array')), node)
		} else {
			node.children.filter(e => e.value)
				.forEach(e => checker(e.value!, ctx))
		}
	}
}
