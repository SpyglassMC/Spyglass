import type { Checker, CheckerContext } from '@spyglassmc/core'
import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonStringAstNode } from '../../node'

export async function string(node: JsonAstNode, ctx: CheckerContext) {
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
	}
}

export function resource(id: string | string[], allowTag = false): Checker<JsonAstNode> {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof id === 'string') {
			node.resource = id
			// TODO
		} else if(!id.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(id, true, 'or')]), node)
		}
	}
}

export function literal(value: string | string[]): Checker<JsonAstNode> {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof value === 'string') {
			// TODO
		} else if(!value.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(value, true, 'or')]), node)
		}
	}
}
