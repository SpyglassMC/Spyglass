import { JsonArrayAstNode, JsonAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function listOf(checker: Checker<JsonAstNode>): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonArrayAstNode.is(node)) {
			ctx.err.report('Expected an array', node)
		} else {
			node.items.forEach(e => checker(e, ctx))
		}
	}
}
