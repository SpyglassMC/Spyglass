import { JsonNumberAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function float(ctx: SchemaContext): ctx is SchemaContext<JsonNumberAstNode> {
	if (!JsonNumberAstNode.is(ctx.node)) {
		ctx.error('Expected a float')
		return false
	}
	return true
}

export function floatRange(min: number | null, max: number | null) {
	return (ctx: SchemaContext) => {
		if (!float(ctx)) return

		if (min !== null && min < ctx.node.value) {
			ctx.error(`Expected a float greater than or equal to ${min}`)
		} else if (max !== null && max > ctx.node.value) {
			ctx.error(`Expected a float smaller than or equal to ${max}`)
		}
	}
}
