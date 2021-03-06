import { arrayToMessage, localize } from '@spyglassmc/locales'
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

export function resource(id: string | string[], allowTag = false): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!string(node, ctx)) {
			return
		} else if (typeof id === 'string') {
			node.resource = id
			// TODO
		} else if(!id.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(id, true, 'or')]), node)
		}
	}
}

export function literal(value: string | string[]): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!string(node, ctx)) {
			return
		} else if (typeof value === 'string') {
			// TODO
		} else if(!value.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(value, true, 'or')]), node)
		}
	}
}
