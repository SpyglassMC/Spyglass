import { JsonBooleanAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function boolean(ctx: SchemaContext): ctx is SchemaContext<JsonBooleanAstNode> {
	if (!JsonBooleanAstNode.is(ctx.node)) {
		ctx.error('Expected a boolean')
		return false
	}
	return true
}
