import { JsonNumberAstNode } from '../../node'
import { CheckerContext } from '../CheckerContext'

export function int(ctx: CheckerContext) {
	if (!JsonNumberAstNode.is(ctx.node) || !ctx.node.isInteger) {
		ctx.report('Expected an int')
	}
}

export function intRange(min: number | null, max: number | null) {
	return (ctx: CheckerContext) => {
		if (!JsonNumberAstNode.is(ctx.node) || !ctx.node.isInteger) {
			ctx.report('Expected an int')
		} else if (min !== null && min < ctx.node.value) {
			ctx.report(`Expected an int larger than or equal to ${min}`)
		} else if (max !== null && max > ctx.node.value) {
			ctx.report(`Expected an int smaller than or equal to ${max}`)
		}
	}
}
