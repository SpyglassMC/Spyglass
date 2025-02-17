import binarySearch from 'binary-search'
import type { DeepReadonly } from '../../common/index.js'
import { ResourceLocation } from '../../common/index.js'
import type { BooleanBaseNode, BooleanNode } from '../../node/BooleanNode.js'
import type {
	CommentNode,
	FileNode,
	FloatNode,
	IntegerNode,
	LiteralBaseNode,
	LiteralNode,
	LongNode,
	PairNode,
	PrefixedNode,
	Quote,
	RecordBaseNode,
	ResourceLocationNode,
	StringBaseNode,
	StringNode,
	SymbolBaseNode,
	SymbolNode,
} from '../../node/index.js'
import { AstNode } from '../../node/index.js'
import type { CompleterContext, MetaRegistry } from '../../service/index.js'
import { LinterConfigValue } from '../../service/index.js'
import type { RangeLike } from '../../source/index.js'
import { Range } from '../../source/index.js'
import { SymbolUtil, type TagFileCategory } from '../../symbol/index.js'
import type { ColorTokenType } from '../colorizer/index.js'
import type { Completer } from './Completer.js'
import { CompletionItem, CompletionKind } from './Completer.js'

/**
 * Uses the shallowest selected node that has its own completer to provide the completion items.
 */
export const dispatch: Completer<AstNode> = (node, ctx) => {
	const child = AstNode.findShallowestChild({
		node: node as AstNode,
		needle: ctx.offset,
		endInclusive: true,
		predicate: (n) => ctx.meta.hasCompleter(n.type),
	})
	return child ? ctx.meta.getCompleter(child.type)(child, ctx) : []
}
export const fallback = dispatch

export const boolean: Completer<BooleanBaseNode> = (node, ctx) => {
	return [
		CompletionItem.create('false', node, { kind: CompletionKind.Constant }),
		CompletionItem.create('true', node, { kind: CompletionKind.Constant }),
	]
}

/**
 * Dispatches to the corresponding file for the language.
 */
export const file: Completer<FileNode<AstNode>> = (node, ctx) => {
	const completer = ctx.meta.getCompleterForLanguageID(ctx.doc.languageId)
	return completer(node.children[0], ctx)
}

export const literal: Completer<LiteralBaseNode> = (node) => {
	const kind = new Map<ColorTokenType, CompletionKind>([
		['enum', CompletionKind.Enum],
		['enumMember', CompletionKind.EnumMember],
		['function', CompletionKind.Function],
		['keyword', CompletionKind.Keyword],
		['literal', CompletionKind.Keyword],
		['number', CompletionKind.Constant],
		['operator', CompletionKind.Operator],
		['property', CompletionKind.Property],
		['resourceLocation', CompletionKind.File],
		['variable', CompletionKind.Variable],
	]).get(node.options.colorTokenType ?? 'keyword') ?? CompletionKind.Keyword
	return (node.options.pool.map((v) => CompletionItem.create(v, node, { kind })) ?? [])
}

export const noop: Completer<any> = () => []

const prefixed: Completer<PrefixedNode> = (node, ctx) => {
	const child = node.children.find(c => c.type !== 'literal')
	if (!child) {
		return [CompletionItem.create('!', node)]
	}
	const childItems = dispatch(child, ctx)
	return childItems.map(item => ({
		...item,
		label: node.prefix + item.label,
		filterText: node.prefix + (item.filterText ?? item.label),
		insertText: node.prefix + (item.insertText ?? item.label),
	}))
}

interface RecordOptions<K extends AstNode, V extends AstNode, N extends RecordBaseNode<K, V>> {
	key: (
		record: DeepReadonly<N>,
		pair: DeepReadonly<PairNode<K, V>> | undefined,
		ctx: CompleterContext,
		range: RangeLike,
		insertValue: boolean,
		insertPairEnd: boolean,
		existingKeys: DeepReadonly<K>[],
	) => CompletionItem[]
	value: (
		record: DeepReadonly<N>,
		pair: DeepReadonly<PairNode<K, V>>,
		ctx: CompleterContext,
		range: RangeLike,
	) => CompletionItem[]
}
export function record<K extends AstNode, V extends AstNode, N extends RecordBaseNode<K, V>>(
	o: RecordOptions<K, V, N>,
): Completer<N> {
	return (node, ctx) => {
		if (!node.innerRange || !Range.contains(node.innerRange, ctx.offset, true)) {
			return []
		}

		const completeKeys = (pair: DeepReadonly<PairNode<K, V>> | undefined) =>
			o.key(node, pair, ctx, pair?.key ?? ctx.offset, false, false, existingKeys)
		const completePairs = (pair: DeepReadonly<PairNode<K, V>> | undefined) =>
			o.key(node, pair, ctx, pair ?? ctx.offset, true, hasNextPair || !!pair?.end, existingKeys)
		const existingKeys = node.children.filter((
			n,
		): n is DeepReadonly<Omit<PairNode<K, V>, 'key'> & { key: K }> => !!n.key).map((n) =>
			n.key as DeepReadonly<K>
		)
		const index = binarySearch(
			node.children,
			ctx.offset,
			(n, o) =>
				n.end
					? Range.compareOffset(Range.translate(n, 0, -1), o, true)
					: Range.compareOffset(n.range, o, true),
		)
		const pair = index >= 0 ? node.children[index] : undefined
		const hasNextPair = !!node.children.find((n) => n.range.start > ctx.offset)
		if (!pair) {
			return completePairs(undefined)
		}

		const { key, sep, value } = pair
		if (!key && !sep && !value) {
			return completePairs(undefined)
		}
		if ((key && Range.contains(key, ctx.offset, true)) || (sep && ctx.offset <= sep.start)) {
			// Selected key.
			if (!value || Range.isEmpty(value.range)) {
				return completePairs(pair)
			}
			return completeKeys(pair)
		}
		if (value && ctx.offset < value.range.start) {
			return o.value(node, pair, ctx, ctx.offset)
		}
		if (
			(value && Range.contains(value, ctx.offset, true))
			|| (sep && ctx.offset >= sep.end)
			|| (key && ctx.offset > key.range.end)
		) {
			// Selected value.
			return o.value(node, pair, ctx, value ?? ctx.offset)
		}

		return []
	}
}

export const resourceLocation: Completer<ResourceLocationNode> = (node, ctx) => {
	const config = LinterConfigValue.destruct(ctx.config.lint.idOmitDefaultNamespace)

	const includeEmptyNamespace = !node.options.requireCanonical && node.namespace === ''
	const includeDefaultNamespace = node.options.requireCanonical || config?.ruleValue !== true
	const excludeDefaultNamespace = !node.options.requireCanonical && config?.ruleValue !== false

	const getPool = (category: string) => {
		const symbols = ctx.symbols.getVisibleSymbols(category, ctx.doc.uri)
		const declarations = Object.entries(symbols).flatMap(([key, symbol]) =>
			SymbolUtil.isDeclared(symbol) ? [key] : []
		)
		return optimizePool(declarations)
	}
	const optimizePool = (pool: readonly string[]) => {
		const defaultNsPrefix = ResourceLocation.DefaultNamespace + ResourceLocation.NamespacePathSep
		const defaultNsIds: string[] = []
		const otherIds: string[] = []
		for (const id of filterPool(pool)) {
			if (id.startsWith(defaultNsPrefix)) {
				defaultNsIds.push(id)
			} else {
				otherIds.push(id)
			}
		}
		const ans = [
			...otherIds,
			...(includeDefaultNamespace ? defaultNsIds : []),
			...(excludeDefaultNamespace
				? defaultNsIds.map((id) => id.slice(defaultNsPrefix.length))
				: []),
			...(includeEmptyNamespace
				? defaultNsIds.map((id) => id.slice(ResourceLocation.DefaultNamespace.length))
				: []),
		]
		if (node.options.namespacePathSep === '.') {
			return ans.map((v) => v.replace(ResourceLocation.NamespacePathSep, '.'))
		}
		return ans
	}
	const filterPool = (pool: readonly string[]) => {
		if (!node.options.implicitPath) {
			return pool
		}
		const ans = []
		for (const id of pool) {
			const sep = id.indexOf(ResourceLocation.NamespacePathSep)
			const path = id.slice(sep + 1)
			if (path.startsWith(node.options.implicitPath)) {
				ans.push(id.slice(0, sep + 1) + path.slice(node.options.implicitPath.length))
			}
		}
		return ans
	}

	const pool = node.options.pool
		? optimizePool(node.options.pool)
		: [
			...(!node.options.requireTag
				? getPool(node.options.category)
				: []),
			...(node.options.allowTag
				? getPool(`tag/${node.options.category}`).map((v) =>
					`${ResourceLocation.TagPrefix}${v}`
				)
				: []),
		]

	const items = pool.map((v) => CompletionItem.create(v, node, { kind: CompletionKind.Function }))

	if (node.options.category) {
		const symbols = ctx.symbols.getVisibleSymbols(node.options.category, ctx.doc.uri)
		const thisKey = Object.entries(symbols).flatMap(([key, symbol]) => {
			if ((symbol.declaration?.[0] ?? symbol.definition?.[0])?.uri === ctx.doc.uri) {
				return [key]
			}
			return []
		})
		if (thisKey.length > 0) {
			items.push(
				CompletionItem.create('THIS', node, {
					kind: CompletionKind.Snippet,
					insertText: thisKey[0],
					detail: thisKey[0],
				}),
			)
		}
	}

	return items
}

export const string: Completer<StringBaseNode> = (node, ctx) => {
	if (node.children?.length) {
		return dispatch(node.children[0], ctx).map(item => ({
			...item,
			filterText: escapeString(item.filterText ?? item.label, node.quote),
			insertText: escapeString(item.insertText ?? item.label, node.quote),
		}))
	}

	if (node.options.quotes && node.value === '') {
		return node.options.quotes.map((q) =>
			CompletionItem.create(`${q}${q}`, node, {
				insertText: `${q}$1${q}`,
				kind: CompletionKind.Value,
			})
		)
	}

	return []
}

export function escapeString(value: string, quote?: Quote) {
	if (!quote) {
		return value
	}
	// Un-escape and then re-escape completion
	value = CompletionItem.unescape(value)
	value = value.replaceAll('\\', '\\\\').replaceAll(quote, '\\"')
	return CompletionItem.escape(value)
}

export const symbol: Completer<SymbolBaseNode> = (node, ctx) => {
	const path = node.options.parentPath ?? []
	const symbols = ctx.symbols.query(ctx.doc, node.options.category, ...path).visibleMembers
	return Object.entries(symbols)
		.filter(([k, v]) => SymbolUtil.isDeclared(v))
		.map(([k, v]) => CompletionItem.create(k, node, { kind: CompletionKind.Variable }))
}

export function registerCompleters(meta: MetaRegistry) {
	meta.registerCompleter<BooleanNode>('boolean', boolean)
	meta.registerCompleter<CommentNode>('comment', noop)
	meta.registerCompleter<FloatNode>('float', noop)
	meta.registerCompleter<IntegerNode>('integer', noop)
	meta.registerCompleter<LongNode>('long', noop)
	meta.registerCompleter<LiteralNode>('literal', literal)
	meta.registerCompleter<PrefixedNode>('prefixed', prefixed)
	meta.registerCompleter<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerCompleter<StringNode>('string', string)
	meta.registerCompleter<SymbolNode>('symbol', symbol)
}
