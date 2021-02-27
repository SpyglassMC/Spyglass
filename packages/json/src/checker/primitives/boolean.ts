import { JsonBooleanAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function boolean(ctx: CheckerContext) {
	if (!JsonBooleanAstNode.is(ctx.node)) {
		ctx.report('Expected a boolean')
	}
}
