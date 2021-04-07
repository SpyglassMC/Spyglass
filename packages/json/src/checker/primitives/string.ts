import type { Parser } from '@spyglassmc/core'
import { Color, ErrorReporter, ErrorSeverity, Failure, ParserContext, Range, Source } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Categories } from '../../binder'
import type { JsonNode } from '../../node'
import { JsonStringNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export async function string(node: JsonNode, ctx: JsonCheckerContext) {
	node.expectation = [{ type: 'json:string', typedoc: 'String' }]
	if (!JsonStringNode.is(node)) {
		ctx.err.report(localize('expected', localize('string')), node)
	}
}

export function resource(id: string | string[], allowTag = false): JsonChecker {
	return async (node: JsonNode, ctx: JsonCheckerContext) => {
		node.expectation = [{ type: 'json:string', typedoc: typedoc(id), pool: id, resource: true }]

		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else if (typeof id === 'string') {
			if (Categories.has(id)) {
				reference(node, ctx, id)
			} else {
				const normalized = node.value.replace(/^minecraft:/, '')
				const doc = localize(`json.doc.${id}.${normalized}`)
				node.hover = `\`\`\`typescript\n(${id}) ${normalized}\n\`\`\`${doc ? `\n******\n${doc}` : ''}`
			}
		} else if (!id.includes(node.value.replace(/^minecraft:/, '')) && !id.includes(node.value)) {
			ctx.err.report(localize('expected', id), node)
		}
	}
}

export function literal(value: string | string[]): JsonChecker {
	return async (node: JsonNode, ctx: JsonCheckerContext) => {
		node.expectation = [{ type: 'json:string', typedoc: typedoc(value), pool: value }]

		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else if (typeof value === 'string') {
			reference(node, ctx, value)
		} else if (!value.includes(node.value)) {
			ctx.err.report(localize('expected', value), node)
		}
	}
}

export function stringColor(): JsonChecker {
	const HexPattern = /^[0-9a-f]{1,6}$/i
	const NamedColors = new Map<string, number>([
		['aqua', 0x55ffff],
		['black', 0x000000],
		['blue', 0x5555ff],
		['dark_aqua', 0x00aaaa],
		['dark_blue', 0x0000aa],
		['dark_gray', 0x555555],
		['dark_green', 0x00aa00],
		['dark_purple', 0xaa00aa],
		['dark_red', 0xaa0000],
		['gold', 0xffaa00],
		['gray', 0xaaaaaa],
		['green', 0x55ff55],
		['light_purple', 0xff55ff],
		['red', 0xff5555],
		['white', 0xffffff],
		['yellow', 0xffff55],
	])
	const ColorNames = [...NamedColors.keys()]

	const parser: Parser<Color> = (src, ctx) => {
		let value = 0
		const start = src.cursor
		if (src.trySkip('#')) {
			const remaining = src.readRemaining()
			if (remaining.match(HexPattern)) {
				value = parseInt(remaining, 16)
			} else {
				ctx.err.report(localize('expected', localize('json.checker.string.hex-color')), Range.create(start, src))
			}
		} else {
			const remaining = src.readRemaining()
			if (NamedColors.has(remaining)) {
				value = NamedColors.get(remaining)!
			} else {
				ctx.err.report(localize('expected', ColorNames), Range.create(start, src))
			}
		}
		return Color.fromCompositeInt(value)
	}

	return (node, ctx) => {
		node.expectation = [{ type: 'json:string', typedoc: typedoc('color'), pool: ColorNames }]
		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else {
			const src = new Source(node.value)
			const parseCtx = ParserContext.create({
				...ctx,
				doc: TextDocument.create('spyglassmc://inner_string', 'plaintext', 0, node.value),
				err: new ErrorReporter(),
			})
			const result = parser(src, parseCtx)
			if (result !== Failure) {
				ctx.err.absorb(parseCtx.err, { map: node.valueMap, doc: ctx.doc })
				node.color = result
			}
		}
	}
}

export function special(name: string, parser: Parser): JsonChecker {
	return (node, ctx) => {
		node.expectation = [{ type: 'json:string', typedoc: typedoc(name) }]
		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else {
			const src = new Source(node.value)
			const parseCtx = ParserContext.create({
				...ctx,
				doc: TextDocument.create('spyglassmc://inner_string', 'plaintext', 0, node.value),
				err: new ErrorReporter(),
			})
			const result = parser(src, parseCtx)
			if (result !== Failure) {
				ctx.err.absorb(parseCtx.err, { map: node.valueMap, doc: ctx.doc })
				node.valueNode = result
			}
		}
	}
}

function typedoc(id: string | string[]) {
	return typeof id === 'string'
		? `String("${id}")`
		: id.length <= 10
			? id.map(e => `"${e}"`).join(' | ')
			: `${id.slice(0, 10).map(e => `"${e}"`).join(' | ')} | ...`
}

function reference(node: JsonStringNode, ctx: JsonCheckerContext, id: string) {
	ctx.symbols.query(ctx.doc, id, node.value)
		.ifUnknown(() => {
			ctx.err.report(localize('json.checker.string.undeclared', id[0].toUpperCase() + id.slice(1), localeQuote(node.value)), node, ErrorSeverity.Warning)
		})
		.elseEnter({
			usage: {
				type: 'reference',
				node,
			},
		})
}
