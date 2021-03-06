import { localize } from '@spyglassmc/locales'
import { JsonAstNode, JsonNumberAstNode } from '../../node'
import { SchemaContext } from '../SchemaContext'

export function int(node: JsonAstNode, ctx: SchemaContext): node is JsonNumberAstNode {
	if (!JsonNumberAstNode.is(node) || !node.isInteger) {
		ctx.err.report(localize('expected', [localize('integer')]), node)
		return false
	}
	return true
}

export function float(node: JsonAstNode, ctx: SchemaContext): node is JsonNumberAstNode {
	if (!JsonNumberAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('float')]), node)
		return false
	}
	return true
}

const range = (schema: (node: JsonAstNode, ctx: SchemaContext) => node is JsonNumberAstNode) => (min: number | null, max: number | null) => {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		if (!schema(node, ctx)) {
			return
		} else if (min !== null && max !== null && (node.value < min || node.value > max)) {
			ctx.err.report(localize('expected', [localize('number.between', [min, max])]), node)
		} else if (min !== null && node.value < min) {
			ctx.err.report(localize('expected', [localize('number.>=', [min])]), node)
		} else if (max !== null && node.value > max) {
			ctx.err.report(localize('expected', [localize('number.<=', [max])]), node)
		}	
	}
}

export const intRange = range(float)

export const floatRange = range(float)
