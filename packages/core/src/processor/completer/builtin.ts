import { ResourceLocation } from '../../common'
import type { AstNode, CommentNode, FileNode, FloatNode, IntegerNode, LiteralBaseNode, LiteralNode, LongNode, ResourceLocationNode, StringBaseNode, StringNode, SymbolBaseNode, SymbolNode } from '../../node'
import type { BooleanBaseNode, BooleanNode } from '../../node/BooleanNode'
import type { MetaRegistry } from '../../service'
import { LinterConfigValue } from '../../service'
import type { TagFileCategory } from '../../symbol'
import { selectedNode } from '../util'
import type { Completer } from './Completer'
import { CompletionItem, CompletionKind } from './Completer'

/**
 * Uses the shallowest selected node that has its own completer to provide the completion items.
 */
export const fallback: Completer<AstNode> = (root, ctx) => {
	const { parents } = selectedNode(root, ctx.offset, true)
	parents.unshift(root)
	for (let i = parents.length - 1; i >= 0; i--) {
		const node = parents[i]
		if (ctx.meta.hasCompleter(node.type)) {
			const completer = ctx.meta.getCompleter(node.type)
			return completer(node, ctx)
		}
	}
	return []
}

export const boolean: Completer<BooleanBaseNode> = (node, ctx) => {
	return [
		CompletionItem.create('false', node, { kind: CompletionKind.Keyword }),
		CompletionItem.create('true', node, { kind: CompletionKind.Keyword }),
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
	return node.options.pool.map(v => CompletionItem.create(v, node, { kind: CompletionKind.Keyword })) ?? []
}

export const noop: Completer<AstNode> = () => []

export const resourceLocation: Completer<ResourceLocationNode> = (node, ctx) => {
	const config = LinterConfigValue.destruct(ctx.config.lint.idOmitDefaultNamespace)

	const lengthBeforeCursor = ctx.offset - node.range.start

	const isEmptyNamespace = lengthBeforeCursor > 0 && node.namespace === ''
	const includeDefaultNamespace = node.options.isPredicate || (!isEmptyNamespace && config?.ruleValue !== true)
	const excludeDefaultNamespace = !node.options.isPredicate && !isEmptyNamespace && config?.ruleValue !== false

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
		return [
			...otherIds,
			...includeDefaultNamespace ? defaultNsIds : [],
			...excludeDefaultNamespace ? defaultNsIds.map(id => id.slice(defaultNsPrefix.length)) : [],
			...isEmptyNamespace ? defaultNsIds.map(id => id.slice(ResourceLocation.DefaultNamespace.length)) : [],
		]
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
		const completer = ctx.meta.getCompleter(node.children[0].type)
		// FIXME: Escape quotes/slashes in the result.
		return completer(node.children[0], ctx)
	}

	// TODO: Complete quotes.
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
