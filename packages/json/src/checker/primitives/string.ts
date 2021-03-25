import { ErrorSeverity } from '@spyglassmc/core'
import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonStringAstNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export async function string(node: JsonAstNode, ctx: JsonCheckerContext) {
	node.typedoc = 'String'
	node.expectation = { type: 'json:string' }
	if(!JsonStringAstNode.is(node)) {
		ctx.err.report(localize('expected', [localize('string')]), node)
	}
}

const referenceable = new Set(['predicate', 'tags/blocks', 'tags/entity_types', 'tags/fluids', 'tags/functions', 'tags/game_events', 'tags/items', ''])

export function resource(id: string | string[], allowTag = false): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.typedoc = typedoc(id)
		node.expectation = { type: 'json:string', pool: id, resource: true }

		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof id === 'string') {
			if (referenceable.has(id)) {
				reference(node, ctx, id)
			} else {
				const normalized = node.value.replace(/^minecraft:/, '')
				const doc = localize(`json.doc.${id}.${normalized}`)
				node.hover = `\`\`\`typescript\n(${id}) ${normalized}\n\`\`\`${doc ? `\n******\n${doc}` : ''}`
			}
		} else if(!id.includes(node.value.replace(/^minecraft:/, '')) && !id.includes(node.value)) {
			ctx.err.report(localize('expected', [arrayToMessage(id, true, 'or')]), node)
		}
	}
}

export function literal(value: string | string[]): JsonChecker {
	return async (node: JsonAstNode, ctx: JsonCheckerContext) => {
		node.typedoc = typedoc(value)
		node.expectation = { type: 'json:string', pool: value }

		if(!JsonStringAstNode.is(node)) {
			ctx.err.report(localize('expected', [localize('string')]), node)
		} else if (typeof value === 'string') {
			reference(node, ctx, value)
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

function reference(node: JsonStringAstNode, ctx: JsonCheckerContext, id: string) {
	ctx.symbols.query(ctx.doc, id, node.value)
		.ifUnknown(() => {
			ctx.err.report(localize('json.checker.string.undeclared', [id[0].toUpperCase() + id.slice(1), localize('punc.quote', [node.value])]), node, ErrorSeverity.Warning)
		})
		.elseEnter({
			usage: 'reference',
			range: node,
		})
}
