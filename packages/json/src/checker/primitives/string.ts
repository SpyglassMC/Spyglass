import { JsonAstNode, JsonStringAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function string(node: JsonAstNode, ctx: CheckerContext) {
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report('Expected a string', node)
	}
}

export function enumString(values: string[]): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report('Expected a string', node.range)
		} else if (!values.includes(node.value)) {
			ctx.err.report(`Expected one of ${values.join(', ')}`, node)
		}
	}
}

export function resource(id: string): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report('Expected a string', node)
		} else {
			node.resource = id
		}
	}
}
