import { localize } from '@spyglassmc/locales'
import { JsonAstNode, JsonStringAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'

export function string(node: JsonAstNode, ctx: SchemaContext): node is JsonStringAstNode {
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
		return false
	}
	return true
}

export function resource(id: string): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (string(node, ctx)) {
			node.resource = id
		}
	}
}
