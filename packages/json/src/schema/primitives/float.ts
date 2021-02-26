import { JsonNumberAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function float(ctx: SchemaContext) {
	if (!JsonNumberAstNode.is(ctx.node)) {
		return ctx.error('expected.float')
	}
	return true
}

export function floatRange(min: number, max: number) {
	return (ctx: SchemaContext) => {
		if (!JsonNumberAstNode.is(ctx.node)) {
			return ctx.error('expected.float')
		}
		if (min < ctx.node.value) {
			return ctx.error('expected.float_larger')
		}
		if (max > ctx.node.value) {
			return ctx.error('expected.float_smaller')
		}
		return true
	}
}
