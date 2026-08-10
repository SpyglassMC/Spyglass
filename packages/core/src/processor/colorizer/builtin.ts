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
	if (node.children) {
		// Collect tokens from every child that owns a colorizer.
		// `UnicodeEscapeNode` siblings need their own multi-segment
		// highlighting, and the value-parser result (when present)
		// gets its own tokens too.
		const tokens: ColorToken[] = []
		for (const child of node.children) {
			if (!ctx.meta.hasColorizer(child.type)) {
				continue
			}
			tokens.push(...ctx.meta.getColorizer(child.type)(child, ctx))
		}
		if (tokens.length) {
			// TODO: Fill the gap between the last token and the ending quote with errors.
			return ColorToken.fillGap(tokens, node.range, node.options.colorTokenType ?? 'string')
		}
	}
	return [ColorToken.create(node, node.options.colorTokenType ?? 'string')]
}

export const symbol: Colorizer<SymbolBaseNode> = (node) => {
	// TODO: Set the modifiers according to `node.symbol`.
	return [ColorToken.create(node, 'variable')]
}

export const unicodeEscape: Colorizer<UnicodeEscapeNode> = (node) => {
	const { range, kind } = node
	const tokens: ColorToken[] = []
	// Backslash + specifier char (`\` and `x`/`u`/`U`/`N`)
	tokens.push(
		ColorToken.create(Range.create(range.start, range.start + 2), 'escape'),
	)
	if (kind === 'N') {
		tokens.push(
			ColorToken.create(Range.create(range.start + 2, range.start + 3), 'escape'),
		)
		tokens.push(
			ColorToken.create(
				Range.create(range.start + 3, range.end - 1),
				'resourceLocation',
			),
		)
		tokens.push(
			ColorToken.create(Range.create(range.end - 1, range.end), 'escape'),
		)
	} else {
		// `\xHH` / `\uHHHH` / `\UHHHHHHHH`: hex digits
		tokens.push(
			ColorToken.create(Range.create(range.start + 2, range.end), 'number'),
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
