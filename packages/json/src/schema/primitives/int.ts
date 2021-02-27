import { JsonNumberAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function int(ctx: SchemaContext): ctx is SchemaContext<JsonNumberAstNode> {
	if (!JsonNumberAstNode.is(ctx.node) || !ctx.node.isInteger) {
		ctx.error('Expected an int')
		return false
	}
	return true
}

export function intRange(min: number | null, max: number | null) {
	return (ctx: SchemaContext) => {
		if (!int(ctx)) return

		if (min !== null && min < ctx.node.value) {
			ctx.error(`Expected an int larger than or equal to ${min}`)
		} else if (max !== null && max > ctx.node.value) {
			ctx.error(`Expected an int smaller than or equal to ${max}`)
		}
	}
}
