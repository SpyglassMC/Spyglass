import { JsonNumberAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function float(ctx: CheckerContext) {
	if (!JsonNumberAstNode.is(ctx.node)) {
		ctx.report('Expected a float')
	}
}

export function floatRange(min: number | null, max: number | null) {
	return (ctx: CheckerContext) => {
		if (!JsonNumberAstNode.is(ctx.node)) {
			ctx.report('Expected a float')
		} else if (min !== null && min < ctx.node.value) {
			ctx.report(`Expected a float greater than or equal to ${min}`)
		} else if (max !== null && max > ctx.node.value) {
			ctx.report(`Expected a float smaller than or equal to ${max}`)
		}
	}
}
