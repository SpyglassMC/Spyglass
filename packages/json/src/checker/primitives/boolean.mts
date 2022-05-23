import { localize } from '@spyglassmc/locales'
import type { JsonNode } from '../../node/index.mjs'
import { JsonBooleanNode } from '../../node/index.mjs'
import type { JsonCheckerContext } from '../JsonChecker.mjs'

export function boolean(node: JsonNode, ctx: JsonCheckerContext) {
	ctx.ops.set(node, 'expectation', [{ type: 'json:boolean', typedoc: 'Boolean' }])

	if (!JsonBooleanNode.is(node)) {
		ctx.err.report(localize('expected', localize('boolean')), node)
	}
}
