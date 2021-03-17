import { localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonArrayAstNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export function listOf(checker: JsonChecker): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.typedoc = 'Array'
		if (!JsonArrayAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('array')]), node)
		} else {
			node.items.forEach(e => checker(e, ctx))
		}
	}
}
