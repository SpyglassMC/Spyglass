import { JsonAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function as(context: string, checker: Checker<JsonAstNode>): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		checker(node, ctx)
		node.context = context
	}
}
