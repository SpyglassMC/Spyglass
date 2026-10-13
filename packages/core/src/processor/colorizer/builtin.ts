import type {
	AstNode,
	BooleanNode,
	CommentNode,
	ErrorNode,
	FloatNode,
	IntegerNode,
	LiteralBaseNode,
	LiteralNode,
	LongNode,
	ResourceLocationBaseNode,
	ResourceLocationNode,
	StringBaseNode,
	StringNode,
	SymbolBaseNode,
	SymbolNode,
	UnicodeEscapeNode,
} from '../../node/index.js'
import type { MetaRegistry } from '../../service/index.js'
import { Range } from '../../source/index.js'
import { traversePreOrder } from '../util.js'
import type { Colorizer, ColorTokenType } from './Colorizer.js'
import { ColorToken } from './Colorizer.js'

/**
 * Use the shallowest children that have their own colorizers to provide the color tokens.
 */
export const fallback: Colorizer = (node, ctx) => {
	const ans: ColorToken[] = []
	traversePreOrder(
		node as AstNode,
		(node) =>
			!ctx.meta.hasColorizer(node.type)
			&& (!ctx.range || Range.intersects(node.range, ctx.range)),
		(node) => ctx.meta.hasColorizer(node.type),
		(node) => {
			const colorizer = ctx.meta.getColorizer(node.type)
			const result = colorizer(node, ctx)
			ans.push(...result)
		},
	)
	return Object.freeze(ans)
}

export const boolean: Colorizer = (node) => {
	return [ColorToken.create(node, 'literal')]
}

export const comment: Colorizer = (node) => {
	return [ColorToken.create(node, 'comment')]
}

export const error: Colorizer = (node) => {
	// return [ColorToken.create(node, 'error')]
	return []
}

export const literal: Colorizer<LiteralBaseNode> = (node) => {
	return [ColorToken.create(node, node.options.colorTokenType ?? 'literal')]
}

export const number: Colorizer = (node) => {
	return [ColorToken.create(node, 'number')]
}

export const resourceLocation: Colorizer<ResourceLocationBaseNode> = (node, _ctx) => {
	let type: ColorTokenType
	switch (node.options.category) {
		case 'function':
		case 'tag/function':
			type = 'function'
			break
		default:
			type = 'resourceLocation'
			break
	}
	return [ColorToken.create(node, type)]
}

export const string: Colorizer<StringBaseNode> = (node, ctx) => {
	if (!node.children) {
		return [ColorToken.create(node, node.options.colorTokenType ?? 'string')]
	}

	const escapeRanges = node.children
		.filter(c => c.type === 'unicode_escape')

	const tokens: ColorToken[] = []
	for (const child of node.children) {
		const emitted = ctx.meta.hasColorizer(child.type)
			? ctx.meta.getColorizer(child.type)(child, ctx)
			: child.children?.length
			? fallback(child, ctx)
			: []
		let tail = 0
		const insert = (piece: ColorToken): void => {
			while (tail < tokens.length && tokens[tail].range.start < piece.range.start) {
				tail++
			}
			tokens.splice(tail, 0, piece)
			tail++
		}
		for (const t of emitted) {
			if (child.type === 'unicode_escape') {
				insert(t)
				continue
			}
			// Clip around escape ranges; emit the disjoint pieces in source order.
			let cursor = t.range.start
			const end = t.range.end
			for (const { range } of escapeRanges) {
				if (range.end <= cursor || range.start >= end) {
					continue
				}
				if (range.start > cursor) {
					insert({ ...t, range: Range.create(cursor, range.start) })
				}
				cursor = Math.max(cursor, range.end)
				if (cursor >= end) {
					break
				}
			}
			if (cursor < end) {
				insert({ ...t, range: Range.create(cursor, end) })
			}
		}
	}

	if (!tokens.length) {
		return [ColorToken.create(node, node.options.colorTokenType ?? 'string')]
	}

	return ColorToken.fillGap(
		tokens,
		node.range,
		node.options.colorTokenType ?? 'string',
	)
}

export const symbol: Colorizer<SymbolBaseNode> = (node) => {
	// TODO: Set the modifiers according to `node.symbol`.
	return [ColorToken.create(node, 'variable')]
}

export const unicodeEscape: Colorizer<UnicodeEscapeNode> = (node) => {
	const { range, kind } = node
	const tokens: ColorToken[] = []
	if (kind === 'N') {
		if (node.prefixRange!.start < node.prefixRange!.end) {
			tokens.push(ColorToken.create(node.prefixRange!, 'escape'))
		}
		tokens.push(
			ColorToken.create(
				Range.create(node.prefixRange!.end, node.suffixRange!.start),
				'resourceLocation',
			),
		)
		if (node.suffixRange!.start < node.suffixRange!.end) {
			tokens.push(ColorToken.create(node.suffixRange!, 'escape'))
		}
	} else {
		// `\xHH` / `\uHHHH` / `\UHHHHHHHH`; highlight the entire escape as `escape`
		tokens.push(
			ColorToken.create(Range.create(range.start, range.end), 'escape'),
		)
	}
	return tokens
}

export function registerColorizers(meta: MetaRegistry) {
	meta.registerColorizer<BooleanNode>('boolean', boolean)
	meta.registerColorizer<CommentNode>('comment', comment)
	meta.registerColorizer<ErrorNode>('error', error)
	meta.registerColorizer<FloatNode>('float', number)
	meta.registerColorizer<IntegerNode>('integer', number)
	meta.registerColorizer<LongNode>('long', number)
	meta.registerColorizer<LiteralNode>('literal', literal)
	meta.registerColorizer<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerColorizer<StringNode>('string', string)
	meta.registerColorizer<SymbolNode>('symbol', symbol)
	meta.registerColorizer<UnicodeEscapeNode>('unicode_escape', unicodeEscape)
}
