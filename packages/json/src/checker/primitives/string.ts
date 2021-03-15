import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonStringAstNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export async function string(node: JsonAstNode, ctx: JsonCheckerContext) {
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
	}
}

export function resource(id: string | string[], allowTag = false): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof id === 'string') {
			node.resource = id
			// TODO
		} else if(!id.includes(node.value.replace(/^minecraft:/, '')) && !id.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(id, true, 'or')]), node)
		}
	}
}

export function literal(value: string | string[]): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof value === 'string') {
			// TODO
		} else if(!value.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(value, true, 'or')]), node)
		}
	}
}
