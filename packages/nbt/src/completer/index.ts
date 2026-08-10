import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type {
	NbtBoolNode,
	NbtCollectionNode,
	NbtCompoundNode,
	NbtNode,
	NbtPathKeyNode,
	NbtPathNode,
	NbtPrimitiveNode,
	NbtStringNode,
	NbtUuidNode,
} from '../node/index.js'

const collection: core.Completer<NbtCollectionNode> = (node, ctx) => {
	const index = core.binarySearch(node.children, ctx.offset, (n, o) => {
		return core.Range.compareOffset(n.range, o, true)
	})
	const item = index >= 0 ? node.children[index] : undefined
	if (item?.value) {
		return ctx.meta.getCompleter(item.value.type)(item.value, ctx)
	}
	if (node.typeDef?.kind === 'list') {
		const completions = getValues(node.typeDef.item, ctx.offset, {
			...ctx,
			requireCanonical: node.requireCanonical,
		})
		if (ctx.offset < (node.children[node.children.length - 1]?.range.start ?? 0)) {
			return completions.map(c => ({ ...c, insertText: c.insertText + ',' }))
		}
		return completions
	}
	return []
}

const compound = core.completer.record<NbtStringNode, NbtNode, NbtCompoundNode>({
	key: (record, pair, ctx, range, iv, ipe, exitingKeys) => {
		if (!record.typeDef) {
			return []
		}
		const keySet = new Set(exitingKeys.map(n => n.value))
		return mcdoc.runtime.completer
			.getFields(record.typeDef, { ...ctx, requireCanonical: record.requireCanonical })
			.filter(({ key }) => !keySet.has(key))
			.map(({ key, field }) =>
				core.CompletionItem.create(key, pair?.key ?? range, {
					kind: core.CompletionKind.Field,
					detail: mcdoc.McdocType.toString(field.type as core.Mutable<mcdoc.McdocType>),
					documentation: field.desc,
					deprecated: field.deprecated,
					sortText: field.optional ? '$b' : '$a', // sort above hardcoded $schema
					filterText: formatKey(key, pair?.key?.quote),
					insertText: `${formatKey(key, pair?.key?.quote)}${iv ? ':' : ''}${ipe ? '$1,' : ''}`,
				})
			)
	},
	value: (record, pair, ctx, range) => {
		if (pair.value) {
			return ctx.meta.getCompleter(pair.value.type)(pair.value, ctx)
		}
		if (pair.key && record.typeDef) {
			const pairKey = pair.key.value
			const field = mcdoc.runtime.completer
				.getFields(record.typeDef, ctx)
				.find(({ key }) => key === pairKey)
				?.field.type
			if (field) {
				return getValues(field, range, {
					...ctx,
					requireCanonical: record.requireCanonical,
				})
			}
		}
		return []
	},
})

const SNBT_FUNCTIONS = ['bool', 'uuid'] as const

const primitive: core.Completer<NbtPrimitiveNode> = (node, ctx) => {
	const insideRange = core.Range.contains(node, ctx.offset, true)
	ctx.logger.info(`[nbt.completer.primitive] enter type=${node.type} offset=${ctx.offset} range=${node.range.start}-${node.range.end} value=${(node as { value?: unknown }).value !== undefined ? JSON.stringify((node as { value: unknown }).value) : 'n/a'} quote=${(node as { quote?: string }).quote ?? 'none'} children=${node.children?.length ?? 0} typeDef=${node.typeDef ? 'set' : 'unset'} insideRange=${insideRange} triggerCharacter=${ctx.triggerCharacter ?? 'none'}`)
	if (node.type === 'nbt:string' && node.children?.length && insideRange) {
		const childItems = core.completer.string(node, ctx)
		if (childItems.length > 0) {
			ctx.logger.info(`[nbt.completer.primitive] exit via string-children, ${childItems.length} items`)
			return childItems
		}
	}
	// The parser doesn't create an `nbt:bool`/`nbt:uuid` node until the
	// opening paren is typed, so partial prefixes (`bo`, `u`, etc.) are
	// parsed as unquoted strings. Detect them here and offer function
	// completions, regardless of whether a typeDef is set (typed fields
	// still benefit from these in many contexts).
	if (
		node.type === 'nbt:string' && !node.quote
		&& SNBT_FUNCTIONS.some((name) => name.startsWith(node.value))
	) {
		const items = SNBT_FUNCTIONS.map((name) =>
			core.CompletionItem.create(
				name,
				core.Range.create(node.range.start, ctx.offset),
				{
					kind: core.CompletionKind.Function,
					filterText: name,
					insertText: name,
				},
			)
		)
		ctx.logger.info(`[nbt.completer.primitive] exit via snbt-prefix, ${items.length} items`)
		return items
	}
	if (!node.typeDef) {
		ctx.logger.info(`[nbt.completer.primitive] exit empty (no typeDef, no snbt prefix)`)
		return []
	}
	const values = getValues(node.typeDef, insideRange ? node : ctx.offset, {
		...ctx,
		requireCanonical: node.requireCanonical,
	})
	ctx.logger.info(`[nbt.completer.primitive] exit via getValues, ${values.length} items`)
	return values
}

const snbtFunction: core.Completer<NbtBoolNode | NbtUuidNode> = (node, ctx) => {
	// Provide `bool` and `uuid` completions. Parens are auto-inserted by the
	// language configuration's `autoClosingPairs`, so the snippets just insert
	// the keyword.
	ctx.logger.info(`[nbt.completer.snbtFunction] enter type=${node.type} offset=${ctx.offset} range=${node.range.start}-${node.range.end}`)
	const keyword = node.type === 'nbt:bool' ? 'bool' : node.type === 'nbt:uuid' ? 'uuid' : ''
	if (!keyword) {
		ctx.logger.info(`[nbt.completer.snbtFunction] exit empty (unknown type)`)
		return []
	}
	ctx.logger.info(`[nbt.completer.snbtFunction] exit with keyword=${keyword}`)
	return [
		core.CompletionItem.create(keyword, node.range, {
			kind: core.CompletionKind.Function,
			filterText: keyword,
			insertText: keyword,
		}),
	]
}

const path: core.Completer<NbtPathNode> = (node, ctx) => {
	const index = core.binarySearch(node.children, ctx.offset, (n, o) => {
		return core.Range.compareOffset(n.range, o, true)
	})
	const item = index >= 0 ? node.children[index] : undefined
	if (item) {
		return ctx.meta.getCompleter(item.type)(item, ctx)
	}
	if (!node.endTypeDef) {
		return []
	}
	return getPathKeys(node.endTypeDef, ctx.offset, undefined, ctx)
}

const pathKey: core.Completer<NbtPathKeyNode> = (node, ctx) => {
	if (!node.typeDef) {
		return []
	}
	const child = node.children[0]
	if (child.children?.length) {
		return core.completer.dispatch(child.children[0], ctx)
	}
	return getPathKeys(node.typeDef, node, child.quote, ctx)
}

function getPathKeys(
	typeDef: core.DeepReadonly<mcdoc.runtime.checker.SimplifiedMcdocType>,
	range: core.RangeLike,
	quote: core.Quote | undefined,
	ctx: core.CompleterContext,
) {
	return mcdoc.runtime.completer
		.getFields(typeDef, { ...ctx, requireCanonical: true })
		.map(({ key, field }) =>
			core.CompletionItem.create(key, range, {
				kind: core.CompletionKind.Field,
				detail: mcdoc.McdocType.toString(field.type as core.Mutable<mcdoc.McdocType>),
				documentation: field.desc,
				deprecated: field.deprecated,
				sortText: field.optional ? '$b' : '$a', // sort above hardcoded $schema
				filterText: formatKey(key, quote),
				insertText: formatKey(key, quote),
			})
		)
}

function getValues(
	typeDef: core.DeepReadonly<mcdoc.McdocType>,
	range: core.RangeLike,
	ctx: mcdoc.runtime.completer.McdocCompleterContext,
): core.CompletionItem[] {
	return mcdoc.runtime.completer.getValues(typeDef, ctx)
		.map((
			{ value, labelSuffix, detail, documentation, kind, completionKind, insertText, sortText },
		) =>
			core.CompletionItem.create(value, range, {
				kind: completionKind ?? core.CompletionKind.Value,
				labelSuffix,
				detail,
				documentation,
				filterText: formatValue(value, kind),
				insertText: formatValue(insertText ?? value, kind),
				sortText,
			})
		)
}

function formatKey(key: string, quote?: core.Quote) {
	if (!quote && core.BrigadierUnquotablePattern.test(key)) {
		return key
	}
	const q = quote ?? '"'
	return q + core.completer.escapeString(key, q) + q
}

function formatValue(value: string, kind?: mcdoc.McdocType['kind']) {
	switch (kind) {
		case 'string':
			return `"${core.completer.escapeString(value, '"')}"`
		case 'byte':
			return `${value}b`
		case 'short':
			return `${value}s`
		case 'long':
			return `${value}L`
		case 'float':
			return `${value}f`
		default:
			return value
	}
}

export function register(meta: core.MetaRegistry): void {
	meta.registerCompleter('nbt:byte', primitive)
	meta.registerCompleter('nbt:byte_array', collection)
	meta.registerCompleter('nbt:compound', compound)
	meta.registerCompleter('nbt:double', primitive)
	meta.registerCompleter('nbt:int', primitive)
	meta.registerCompleter('nbt:int_array', collection)
	meta.registerCompleter('nbt:list', collection)
	meta.registerCompleter('nbt:long', primitive)
	meta.registerCompleter('nbt:long_array', collection)
	meta.registerCompleter('nbt:string', primitive)
	meta.registerCompleter('nbt:short', primitive)
	meta.registerCompleter('nbt:float', primitive)
	meta.registerCompleter('nbt:hex', primitive)
	meta.registerCompleter('nbt:bin', primitive)
	meta.registerCompleter<NbtBoolNode>('nbt:bool', snbtFunction)
	meta.registerCompleter<NbtUuidNode>('nbt:uuid', snbtFunction)

	meta.registerCompleter('nbt:path', path)
	meta.registerCompleter('nbt:path/key', pathKey)
}
