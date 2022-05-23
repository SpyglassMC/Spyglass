import { localize } from '@spyglassmc/locales'
import type { JsonNode } from '../../node/index.js'
import { JsonBooleanNode } from '../../node/index.js'
import type { JsonCheckerContext } from '../JsonChecker.js'

export function boolean(node: JsonNode, ctx: JsonCheckerContext) {
	ctx.ops.set(node, 'expectation', [{ type: 'json:boolean', typedoc: 'Boolean' }])

	if (!JsonBooleanNode.is(node)) {
		ctx.err.report(localize('expected', localize('boolean')), node)
	}
}
