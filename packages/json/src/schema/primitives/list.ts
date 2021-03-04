import { localize } from '@spyglassmc/locales'
import { JsonArrayAstNode, JsonAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'

export function listOf(schema: Schema<JsonAstNode>): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!JsonArrayAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('array')]), node)
		} else {
			node.items.forEach(e => schema(e, ctx))
		}
	}
}
