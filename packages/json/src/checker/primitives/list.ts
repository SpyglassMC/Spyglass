import type { Checker, CheckerContext } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonArrayAstNode } from '../../node'

export function listOf(checker: Checker<JsonAstNode>): Checker<JsonAstNode> {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonArrayAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('array')]), node)
		} else {
			node.items.forEach(e => checker(e, ctx))
		}
	}
}
