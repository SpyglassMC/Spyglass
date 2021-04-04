import { localize } from '@spyglassmc/locales'
import type { JsonArrayExpectation, JsonAstNode } from '../../node'
import { JsonArrayAstNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'
import { expectation } from './util'

export function listOf(checker: JsonChecker): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.expectation = [{ type: 'json:array', typedoc: 'Array' }]
		if (!ctx.depth || ctx.depth <= 0) {
			(node.expectation[0] as JsonArrayExpectation).items = expectation(checker, ctx)
		}

		if (!JsonArrayAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('array')]), node)
		} else {
			node.items.forEach(e => checker(e, ctx))
		}
	}
}
