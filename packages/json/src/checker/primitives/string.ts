import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonStringAstNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export async function string(node: JsonAstNode, ctx: JsonCheckerContext) {
	node.typedoc = 'String'
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
	}
}

export function resource(id: string | string[], allowTag = false): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.typedoc = typedoc(id)
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof id === 'string') {
			const normalized = node.value.replace(/^minecraft:/, '')
			node.resource = id
			const doc = localize(`json.doc.${id}.${normalized}`)
			node.hover = `\`\`\`typescript\n(${id}) ${normalized}\n\`\`\`${doc ? `\n******\n${doc}` : ''}`
			// TODO
		} else if(!id.includes(node.value.replace(/^minecraft:/, '')) && !id.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(id, true, 'or')]), node)
		}
	}
}

export function literal(value: string | string[]): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.typedoc = typedoc(value)
		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof value === 'string') {
			// TODO
		} else if(!value.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(value, true, 'or')]), node)
		}
	}
}

function typedoc(id: string | string[]) {
	return typeof id === 'string'
		? `String('${id}')`
		:	id.length <= 10
			? id.map(e => `"${e}"`).join(' | ')
			: 'String'
}
