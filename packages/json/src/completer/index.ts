import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type {
	JsonArrayNode,
	JsonNode,
	JsonObjectNode,
	JsonPrimitiveNode,
	JsonStringNode,
} from '../node/index.js'

const array: core.Completer<JsonArrayNode> = (node, ctx) => {
	const index = core.binarySearch(node.children, ctx.offset, (n, o) => {
		return core.Range.compareOffset(n.range, o, true)
	})
	const item = index >= 0 ? node.children[index] : undefined
	if (item?.value) {
		return ctx.meta.getCompleter(item.value.type)(item.value, ctx)
	}
	if (node.typeDef?.kind === 'list') {
		const completions = getValues(node.typeDef.item, ctx.offset, ctx)
		if (ctx.offset < node.children[node.children.length - 1]?.range.start ?? 0) {
			return completions.map(c => ({ ...c, insertText: c.insertText + ',' }))
		}
		return completions
	}
	return []
}

const object = core.completer.record<JsonStringNode, JsonNode, JsonObjectNode>({
	key: (record, pair, ctx, range, iv, ipe, exitingKeys) => {
		if (!record.typeDef) {
			return []
		}
		const keySet = new Set(exitingKeys.map(n => n.value))
		return mcdoc.runtime.completer
			.getFields(record.typeDef, ctx)
			.filter(({ key }) => !keySet.has(key))
			.map(({ key, field }) =>
				core.CompletionItem.create(key, pair?.key ?? range, {
					kind: core.CompletionKind.Field,
					detail: mcdoc.McdocType.toString(field.type as core.Mutable<mcdoc.McdocType>),
					deprecated: field.deprecated,
					sortText: field.optional ? '$b' : '$a', // sort above hardcoded $schema
					filterText: `"${key}"`,
					insertText: `"${key}"${iv ? ': ' : ''}${ipe ? '$1,' : ''}`,
				})
			)
	},
	value: (record, pair, ctx, range) => {
		if (pair.value) {
			return ctx.meta.getCompleter(pair.value.type)(pair.value, ctx)
		}
		if (pair.key && record.typeDef) {
			const pairKey = pair.key.value
			const field = mcdoc.runtime.completer.getFields(record.typeDef, ctx)
				.find(({ key }) => key === pairKey)
				?.field.type
			if (field) {
				return getValues(field, range, ctx)
			}
		}
		return []
	},
})

const primitive: core.Completer<JsonPrimitiveNode> = (node, ctx) => {
	const insideRange = core.Range.contains(node, ctx.offset, true)
	if (node.type === 'json:string' && node.children?.length && insideRange) {
		const childItems = core.completer.string(node, ctx)
		if (childItems.length > 0) {
			return childItems
		}
	}
	if (!node.typeDef) {
		return []
	}
	return getValues(node.typeDef, insideRange ? node : ctx.offset, ctx)
}

function getValues(
	typeDef: core.DeepReadonly<mcdoc.McdocType>,
	range: core.RangeLike,
	ctx: core.CompleterContext,
): core.CompletionItem[] {
	return mcdoc.runtime.completer.getValues(typeDef, ctx)
		.map(({ value, detail, kind, completionKind, insertText }) =>
			core.CompletionItem.create(value, range, {
				kind: completionKind ?? core.CompletionKind.Value,
				detail,
				filterText: kind === 'string' ? `"${value}"` : value,
				insertText: kind === 'string' ? `"${insertText ?? value}"` : insertText ?? value,
			})
		)
}

export function register(meta: core.MetaRegistry): void {
	meta.registerCompleter('json:array', array)
	meta.registerCompleter('json:boolean', primitive)
	meta.registerCompleter('json:number', primitive)
	meta.registerCompleter('json:null', primitive)
	meta.registerCompleter('json:object', object)
	meta.registerCompleter('json:string', primitive)
}
