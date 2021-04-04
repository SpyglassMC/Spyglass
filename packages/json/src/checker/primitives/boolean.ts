import { localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonBooleanAstNode } from '../../node'
import type { JsonCheckerContext } from '../JsonChecker'

export async function boolean(node: JsonAstNode, ctx: JsonCheckerContext) {
	node.expectation = [{ type: 'json:boolean', typedoc: 'Boolean' }]

	if (!JsonBooleanAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('boolean')]), node)
	}
}
