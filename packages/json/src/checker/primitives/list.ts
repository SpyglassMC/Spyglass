import { JsonArrayAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function listOf(checker: Checker) {
	return (ctx: CheckerContext) => {
		if (!JsonArrayAstNode.is(ctx.node)) {
			ctx.report('Expected an array')
		} else {
			ctx.node.items.forEach(e => checker(ctx.with(e)))
		}
	}
}
