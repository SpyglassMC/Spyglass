import { JsonStringAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function string(ctx: SchemaContext) {
	if(!JsonStringAstNode.is(ctx.node)) {
		return ctx.error('expected.string')
	}
	return true
}

export function enumString(values: string[]) {
	return (ctx: SchemaContext) => {
		if(!JsonStringAstNode.is(ctx.node)) {
			return ctx.error('expected.string')
		}
		if (!values.includes(ctx.node.value)) {
			return ctx.error('')
		}
		return true
	}
}
