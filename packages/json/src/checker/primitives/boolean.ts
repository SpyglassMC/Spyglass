import { JsonAstNode, JsonBooleanAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function boolean(node: JsonAstNode, ctx: CheckerContext) {
	if (!JsonBooleanAstNode.is(node)) {
		ctx.err.report('Expected a boolean', node)
	}
}
