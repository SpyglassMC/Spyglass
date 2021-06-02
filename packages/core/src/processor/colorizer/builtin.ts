import type { BooleanNode, CommentNode, ErrorNode, FloatNode, IntegerNode, LiteralBaseNode, LiteralNode, LongNode, ResourceLocationBaseNode, ResourceLocationNode, StringBaseNode, StringNode, SymbolBaseNode, SymbolNode } from '../../node'
import type { MetaRegistry } from '../../service'
import { IndexMap, Range } from '../../source'
import { traversePreOrder } from '../util'
import type { Colorizer, ColorTokenType } from './Colorizer'
import { ColorToken } from './Colorizer'

/**
 * Use the shallowest children that have their own colorizers to provide the color tokens.
 */
export const fallback: Colorizer = (node, ctx) => {
	const ans: ColorToken[] = []
	traversePreOrder(node,
		({ node, map }) => !ctx.meta.hasColorizer(node.type) && (!ctx.options.range || Range.intersects(node.range, IndexMap.toInnerRange(map, ctx.options.range))),
		({ node }) => ctx.meta.hasColorizer(node.type),
		({ node, map }) => {
			const colorizer = ctx.meta.getColorizer(node.type)
			const result = colorizer(node, ctx)
			ans.push(...result.map(token => toOuterColorToken(map, token)))
		}
	)
	return Object.freeze(ans)
}

export const boolean: Colorizer = node => {
	return [ColorToken.create(node, 'literal')]
}

export const comment: Colorizer = node => {
	return [ColorToken.create(node, 'comment')]
}

export const error: Colorizer = node => {
	return [ColorToken.create(node, 'error')]
}

export const literal: Colorizer<LiteralBaseNode> = node => {
	return [ColorToken.create(node, node.options.colorTokenType ?? 'literal')]
}

export const number: Colorizer = node => {
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
		const colorizer = ctx.meta.getColorizer(node.children[0].type)
		const result = colorizer(node.children[0], ctx)
		// TODO: Fill the gap between the last token and the ending quote with errors.
		return ColorToken.fillGap(
			result.map(token => toOuterColorToken(node.childrenMaps[0], token)),
			node.range, node.options.colorTokenType ?? 'string')
	} else {
		return [ColorToken.create(node, 'string')]
	}
}

export const symbol: Colorizer<SymbolBaseNode> = node => {
	// TODO: Set the modifiers according to `node.symbol`.
	return [ColorToken.create(node, 'variable')]
}

function toOuterColorToken(map: IndexMap, token: ColorToken) {
	return {
		...token,
		range: IndexMap.toOuterRange(map, token.range),
	}
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
}
