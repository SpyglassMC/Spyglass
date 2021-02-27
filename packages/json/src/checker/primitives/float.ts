import { JsonAstNode, JsonNumberAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function float(node: JsonAstNode, ctx: CheckerContext) {
	if (!JsonNumberAstNode.is(node)) {
		ctx.err.report('Expected a float', node)
	}
}

export function floatRange(min: number | null, max: number | null) {
	return (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonNumberAstNode.is(node)) {
			ctx.err.report('Expected a float', node)
		} else if (min !== null && min < node.value) {
			ctx.err.report(`Expected a float greater than or equal to ${min}`, node)
		} else if (max !== null && max > node.value) {
			ctx.err.report(`Expected a float smaller than or equal to ${max}`, node)
		}
	}
}
