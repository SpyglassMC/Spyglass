import { localize } from '@spyglassmc/locales'
import { JsonAstNode, JsonStringAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function string(node: JsonAstNode, ctx: CheckerContext): node is JsonStringAstNode {
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
		return false
	}
	return true
}

export function resource(id: string): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (string(node, ctx)) {
			node.resource = id
		}
	}
}
