import type { CheckerContext } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonBooleanAstNode } from '../../node'

export async function boolean(node: JsonAstNode, ctx: CheckerContext) {
	if (!JsonBooleanAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('boolean')]), node)
	}
}
