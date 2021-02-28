import { JsonAstNode, JsonNumberAstNode } from '../../node'
import { Checker } from '../Checker'
import { CheckerContext } from '../CheckerContext'

export function int(node: JsonAstNode, ctx: CheckerContext) {
	if (!JsonNumberAstNode.is(node) || !node.isInteger) {
		ctx.err.report('Expected an int', node)
	}
}

export function intRange(min: number | null, max: number | null): Checker<JsonAstNode> {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonNumberAstNode.is(node) || !node.isInteger) {
			ctx.err.report('Expected an int', node)
		} else if (min !== null && min < node.value) {
			ctx.err.report(`Expected an int larger than or equal to ${min}`, node)
		} else if (max !== null && max > node.value) {
			ctx.err.report(`Expected an int smaller than or equal to ${max}`, node)
		}
	}
}
