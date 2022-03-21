import { ResourceLocation } from '../../common'
import type { CommentNode, FileNode, FloatNode, IntegerNode, LiteralBaseNode, LiteralNode, LongNode, ResourceLocationNode, StringBaseNode, StringNode, SymbolBaseNode, SymbolNode } from '../../node'
import { AstNode } from '../../node'
import type { BooleanBaseNode, BooleanNode } from '../../node/BooleanNode'
import type { MetaRegistry } from '../../service'
import { LinterConfigValue } from '../../service'
import type { TagFileCategory } from '../../symbol'
import type { ColorTokenType } from '../colorizer'
import type { Completer } from './Completer'
import { CompletionItem, CompletionKind } from './Completer'

/**
 * Uses the shallowest selected node that has its own completer to provide the completion items.
 */
export const dispatch: Completer<AstNode> = (node, ctx) => {
	const child = AstNode.findShallowestChild({
		node,
		needle: ctx.offset,
		endInclusive: true,
		predicate: n => ctx.meta.hasCompleter(n.type),
	})
	return child
		? ctx.meta.getCompleter(child.type)(child, ctx)
		: []
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

export const literal: Completer<LiteralBaseNode> = node => {
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
	return node.options.pool.map(v => CompletionItem.create(v, node, { kind })) ?? []
}

export const noop: Completer<any> = () => []

export const resourceLocation: Completer<ResourceLocationNode> = (node, ctx) => {
	const config = LinterConfigValue.destruct(ctx.config.lint.idOmitDefaultNamespace)

	const includeEmptyNamespace = !node.options.isPredicate && node.namespace === ''
	const includeDefaultNamespace = node.options.isPredicate || config?.ruleValue !== true
	const excludeDefaultNamespace = !node.options.isPredicate && config?.ruleValue !== false

	const getPool = (category: string) => optimizePool(Object.keys(ctx.symbols.getVisibleSymbols(ctx.doc.uri, category)))
	const optimizePool = (pool: string[]) => {
		const defaultNsPrefix = `${ResourceLocation.DefaultNamespace}${ResourceLocation.NamespacePathSep}`
		const defaultNsIds: string[] = []
		const otherIds: string[] = []
		for (const id of pool) {
			if (id.startsWith(defaultNsPrefix)) {
				defaultNsIds.push(id)
			} else {
				otherIds.push(id)
			}
		}
		const ans = [
			...otherIds,
			...includeDefaultNamespace ? defaultNsIds : [],
			...excludeDefaultNamespace ? defaultNsIds.map(id => id.slice(defaultNsPrefix.length)) : [],
			...includeEmptyNamespace ? defaultNsIds.map(id => id.slice(ResourceLocation.DefaultNamespace.length)) : [],
		]
		if (node.options.namespacePathSep === '.') {
			return ans.map(v => v.replace(ResourceLocation.NamespacePathSep, '.'))
		}
		return ans
	}

	const pool = node.options.pool
		? optimizePool(node.options.pool)
		: [
			...getPool(node.options.category!),
			...node.options.allowTag
				? getPool(`tag/${node.options.category}` as TagFileCategory)
					.map(v => `${ResourceLocation.TagPrefix}${v}`)
				: [],
		]

	return pool.map(v => CompletionItem.create(v, node, { kind: CompletionKind.Function }))
}

export const string: Completer<StringBaseNode> = (node, ctx) => {
	if (node.children?.length) {
		// FIXME: Escape quotes/slashes in the result. Note that `\`, `$`, and `}` have to be escaped due to TextMate syntax.
		return dispatch(node.children[0], ctx)
	}

	if (node.options.quotes && node.value === '') {
		return node.options.quotes.map(q => CompletionItem.create(`${q}${q}`, node, {
			insertText: `${q}$1${q}`,
			kind: CompletionKind.Value,
		}))
	}

	return []
}

export const symbol: Completer<SymbolBaseNode> = (node, ctx) => {
	return Object
		.keys(ctx.symbols.query(ctx.doc, node.options.category, ...node.options.parentPath ?? []).visibleMembers)
		.map(v => CompletionItem.create(v, node, { kind: CompletionKind.Variable }))
}

export function registerCompleters(meta: MetaRegistry) {
	meta.registerCompleter<BooleanNode>('boolean', boolean)
	meta.registerCompleter<CommentNode>('comment', noop)
	meta.registerCompleter<FloatNode>('float', noop)
	meta.registerCompleter<IntegerNode>('integer', noop)
	meta.registerCompleter<LongNode>('long', noop)
	meta.registerCompleter<LiteralNode>('literal', literal)
	meta.registerCompleter<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerCompleter<StringNode>('string', string)
	meta.registerCompleter<SymbolNode>('symbol', symbol)
}
