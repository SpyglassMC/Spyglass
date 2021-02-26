import { JsonNumberAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function int(ctx: SchemaContext) {
	if (!JsonNumberAstNode.is(ctx.node) || !ctx.node.isInteger) {
		return ctx.error('expected.int')
	}
	return true
}

export function intRange(min: number, max: number) {
	return (ctx: SchemaContext) => {
		if (!JsonNumberAstNode.is(ctx.node) || !ctx.node.isInteger) {
			return ctx.error('expected.int')
		}
		if (min < ctx.node.value) {
			return ctx.error('expected.int_larger')
		}
		if (max > ctx.node.value) {
			return ctx.error('expected.int_smaller')
		}
		return true
	}
}
