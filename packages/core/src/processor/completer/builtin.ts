import type { AstNode, FloatBaseNode, FloatNode, IntegerBaseNode, IntegerNode, LiteralBaseNode, LiteralNode, QuoteTypeConfig, StringBaseNode, StringNode, SymbolBaseNode, SymbolNode } from '../../node'
import { ResourceLocationNode } from '../../node'
import type { CompleterContext, MetaRegistry } from '../../service'
import { IndexMap, Range } from '../../source'
import type { TagFileCategory } from '../../symbol'
import { selectedNode } from '../util'
import type { Completer } from './Completer'
import { CompletionItem, CompletionKind } from './Completer'

/**
 * Uses the deepest selected node that has its own completer to provide the completion items.
 */
export const fallback: Completer<AstNode> = (node, ctx) => {
	const result = selectedNode(node, ctx.offset)
	if (result) {
		for (const n of [result.node, ...result.parents]) {
			if (ctx.meta.hasCompleter(n.type)) {
				const completer = ctx.meta.getCompleter(n.type)
				return completer(n, ctx)
			}
		}
	}
	return []
}

export const literal: Completer<LiteralBaseNode> = node => {
	return node.options.pool.map(v => CompletionItem.create(v, node, undefined, { kind: CompletionKind.Constant }))
}

export const number: Completer<IntegerBaseNode | FloatBaseNode> = node => {
	return []
}

export const resourceLocation: Completer<ResourceLocationNode> = (node, ctx) => {
	const configIdOmitDefaultNamespace: boolean | null = null // TODO: Use real config.

	const lengthBeforeCursor = ctx.offset - node.range.start

	const isEmptyNamespace = lengthBeforeCursor > 0 && node.namespace === ''
	const includeDefaultNamespace = !isEmptyNamespace && configIdOmitDefaultNamespace !== true
	const excludeDefaultNamespace = !isEmptyNamespace && configIdOmitDefaultNamespace !== false

	const getPool = (category: string) => optimizePool(Object.keys(ctx.symbols.getVisibleSymbols(ctx.doc.uri, category)))
	const optimizePool = (pool: string[]) => {
		const defaultNsPrefix = `${ResourceLocationNode.DefaultNamespace}${ResourceLocationNode.NamespacePathSep}`
		const defaultNsIds: string[] = []
		const otherIds: string[] = []
		for (const id of pool) {
			if (id.startsWith(defaultNsPrefix)) {
				defaultNsIds.push(id)
			} else {
				otherIds.push(id)
			}
		}
		return [
			...otherIds,
			...includeDefaultNamespace ? defaultNsIds : [],
			...excludeDefaultNamespace ? defaultNsIds.map(id => id.slice(defaultNsPrefix.length)) : [],
			...isEmptyNamespace ? defaultNsIds.map(id => id.slice(ResourceLocationNode.DefaultNamespace.length)) : [],
		]
	}

	const pool = node.options.pool
		? optimizePool(node.options.pool)
		: [
			...getPool(node.options.category),
			...node.options.allowTag
				? getPool(`tag/${node.options.category}` as TagFileCategory)
					.map(v => `${ResourceLocationNode.TagPrefix}${v}`)
				: [],
		]

	return pool.map(v => CompletionItem.create(
		v, node, v,
		{ kind: CompletionKind.Function }
	))
}

export const string: Completer<StringBaseNode> = (node, ctx) => {
	const configStringQuote: boolean | null = null // TODO: Use real config.
	const configStringQuoteType: QuoteTypeConfig | null = null // TODO: Use real config.

	// TODO: Complete when the cursor is outside the quotes.

	if (node.valueNode && Range.contains(node.valueMap.outerRange, ctx.offset)) {
		const completer = ctx.meta.getCompleter(node.valueNode.type)
		const result = completer(node.valueNode, toInnerCtx(ctx, node.valueMap))
		return toOuterItems(result, node.valueMap)
	}

	return []
}

export const symbol: Completer<SymbolBaseNode> = (node, ctx) => {
	return Object
		.keys(ctx.symbols.getVisibleSymbols(node.options.category))
		.map(v => CompletionItem.create(v, node, undefined, { kind: CompletionKind.Variable }))
}

function toOuterItems(items: readonly CompletionItem[], mapping: IndexMap): CompletionItem[] {
	return items.map(item => ({
		...item,
		range: IndexMap.toOuterRange(mapping, item.range),
	}))
}

function toInnerCtx(ctx: CompleterContext, mapping: IndexMap): CompleterContext {
	return {
		...ctx,
		offset: IndexMap.toInnerOffset(mapping, ctx.offset),
	}
}

export function registerCompleters(meta: MetaRegistry) {
	meta.registerCompleter<FloatNode>('float', number)
	meta.registerCompleter<IntegerNode>('integer', number)
	meta.registerCompleter<LiteralNode>('literal', literal)
	meta.registerCompleter<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerCompleter<StringNode>('string', string)
	meta.registerCompleter<SymbolNode>('symbol', symbol)
}
