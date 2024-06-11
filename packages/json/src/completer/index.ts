import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type {
	JsonArrayNode,
	JsonBooleanNode,
	JsonNumberNode,
	JsonObjectNode,
} from '../node/index.js'
import { JsonStringNode } from '../node/index.js'

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
		if (
			ctx.offset < node.children[node.children.length - 1]?.range.start ?? 0
		) {
			return completions.map(c => ({ ...c, insertText: c.insertText + ',' }))
		}
		return completions
	}
	return []
}

const object: core.Completer<JsonObjectNode> = (node, ctx) => {
	return core.completer.record({
		key: (_r, pair, _c, range, iv, ipe, exitingKeys) => {
			if (!node.typeDef) {
				return []
			}
			const keySet = new Set(exitingKeys.flatMap(n => {
				return JsonStringNode.is(n) ? [n.value] : []
			}))
			return mcdoc.runtime.completer.getFields(node.typeDef)
				.filter(({ key }) => !keySet.has(key))
				.map(({ key, field }) =>
					core.CompletionItem.create(key, pair?.key ?? range, {
						kind: core.CompletionKind.Field,
						detail: mcdoc.McdocType.toString(
							field.type as core.Mutable<mcdoc.McdocType>,
						),
						deprecated: field.deprecated,
						sortText: field.optional ? '$b' : '$a', // sort above hardcoded $schema
						filterText: `"${key}"`,
						insertText: `"${key}"${iv ? ': ' : ''}${ipe ? '$1,' : ''}`,
					})
				)
		},
		value: (_r, pair, ctx, range) => {
			if (pair.value) {
				return ctx.meta.getCompleter(pair.value.type)(pair.value, ctx)
			}
			if (pair.key && JsonStringNode.is(pair.key) && node.typeDef) {
				const pairKey = pair.key.value
				const field = mcdoc.runtime.completer.getFields(node.typeDef)
					.find(({ key }) => key === pairKey)
					?.field.type
				if (field) {
					return getValues(field, range, ctx)
				}
			}
			return []
		},
	})(node as any, ctx)
}

const primitive: core.Completer<
	JsonStringNode | JsonNumberNode | JsonBooleanNode
> = (node, ctx) => {
	if (!node.typeDef) {
		return []
	}
	if (
		node.children && node.children.length > 0 &&
		core.Range.contains(core.Range.translate(node, 1, -1), ctx.offset, true)
	) {
		const child = node.children[0]
		return ctx.meta.getCompleter(child.type)(child, ctx)
	}
	const range = core.Range.contains(node, ctx.offset, true) ? node : ctx.offset
	return getValues(node.typeDef, range, ctx)
}

function getValues(
	typeDef: core.DeepReadonly<mcdoc.McdocType>,
	range: core.RangeLike,
	ctx: core.CompleterContext,
): core.CompletionItem[] {
	return mcdoc.runtime.completer.getValues(typeDef, ctx)
		.map(({ value, detail, kind }) =>
			core.CompletionItem.create(value, range, {
				kind: core.CompletionKind.Value,
				detail: detail,
				filterText: kind === 'string' ? `"${value}"` : value,
				insertText: kind === 'string' ? `"${value}"` : value,
			})
		)
}

export function register(meta: core.MetaRegistry): void {
	meta.registerCompleter<JsonArrayNode>('json:array', array)
	meta.registerCompleter<JsonBooleanNode>('json:boolean', primitive)
	meta.registerCompleter<JsonNumberNode>('json:number', primitive)
	meta.registerCompleter<JsonObjectNode>('json:object', object)
	meta.registerCompleter<JsonStringNode>('json:string', primitive)
}
