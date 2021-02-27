import { JsonArrayAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'

export function listOf(schema: Schema) {
	return (ctx: SchemaContext) => {
		if (!JsonArrayAstNode.is(ctx.node)) {
			return ctx.error('Expected an array')
		}
		ctx.node.items.every(e => schema(ctx.with(e)))
	}
}
