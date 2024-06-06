import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { JsonArrayNode, JsonObjectNode } from '../node/index.js'
import { JsonStringNode } from '../node/index.js'

const array: core.Completer<JsonArrayNode> = (node, ctx) => {
	const index = core.binarySearch(node.children, ctx.offset, (n, o) => {
		return core.Range.compareOffset(n.range, o, true)
	})
	const item = index >= 0 ? node.children[index] : undefined
	if (!item || !core.ItemNode.is(item) || !item.value) {
		// TODO: figure out how to autocomplete when there is no item node
		return []
	}
	return ctx.meta.getCompleter(item.value.type)(item.value, ctx)
}

const object: core.Completer<JsonObjectNode> = (node, ctx) => {
	return core.completer.record({
		key: (_r, pair, _c, range, _iv, _ip, exitingKeys) => {
			if (!node.typeDef) return []
			const keyRange = pair?.key?.range ?? range
			const keySet = new Set(exitingKeys.flatMap(n => {
				return JsonStringNode.is(n) ? [n.value] : []
			}))
			return mcdoc.runtime.completer.getFields(node.typeDef)
				.filter(({ key }) => !keySet.has(key))
				.map(({ key, field }) =>
					core.CompletionItem.create(key, keyRange, {
						kind: core.CompletionKind.Field,
						detail: mcdoc.McdocType.toString(
							field.type as core.Mutable<mcdoc.McdocType>,
						),
						sortText: field.optional ? 'z' : 'a',
						filterText: `"${key}"`,
						insertText: `"${key}"${pair?.value ? '' : ': '}`,
					})
				)
		},
		value: (_r, pair, ctx) => {
			if (!pair.value) return []
			return ctx.meta.getCompleter(pair.value.type)(pair.value, ctx)
		},
	})(node as any, ctx)
}

export function register(meta: core.MetaRegistry): void {
	meta.registerCompleter<JsonArrayNode>('json:array', array)
	meta.registerCompleter<JsonObjectNode>('json:object', object)
}
