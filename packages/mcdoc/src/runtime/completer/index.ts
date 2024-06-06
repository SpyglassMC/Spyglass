import * as core from '@spyglassmc/core'
import { McdocType } from '../../type/index.js'

export interface McdocCompleterOptions<T extends core.AstNode> {
	matchesType: (
		node: core.DeepReadonly<T>,
		typeDef: core.DeepReadonly<McdocType>,
	) => boolean
	getString: (node: core.DeepReadonly<core.AstNode>) => string | undefined
	mapField: (item: core.CompletionItem) => core.CompletionItem
}

export function entry<T extends core.AstNode>(
	typeDef: core.DeepReadonly<McdocType>,
	options: McdocCompleterOptions<T>,
): core.Completer<T> {
	return (node, ctx) => {
		if (typeDef.kind === 'union') {
			return typeDef.members.flatMap(m => entry(m, options)(node, ctx))
		}
		if (!options.matchesType(node, typeDef)) {
			return []
		}
		switch (typeDef.kind) {
			case 'struct':
				return core.completer.record({
					key: (_r, pair, _c, range, _iv, _ip, exitingKeys) => {
						const keyRange = pair?.key?.range ?? range
						const keySet = new Set(exitingKeys.map(options.getString))
						return typeDef.fields
							.flatMap(field => {
								// TODO: handle attributes
								if (field.kind === 'spread') return []
								if (typeof field.key === 'string') {
									return [{ key: field.key, field }]
								}
								if (field.key.kind === 'literal') {
									return [{ key: `${field.key.value.value}`, field }]
								}
								return []
							})
							.filter(({ key }) => !keySet.has(key))
							.map(({ key, field }) =>
								core.CompletionItem.create(key, keyRange, {
									kind: core.CompletionKind.Field,
									detail: McdocType.toString(
										field.type as core.Mutable<McdocType>,
									),
									sortText: field.optional ? 'z' : 'a',
								})
							)
							.map(item => options.mapField(item))
					},
					value: (_r, pair, ctx) => {
						if (!pair.value) {
							return []
						}
						return ctx.meta.getCompleter(pair.value.type)(pair.value, ctx)
					},
				})(node as any, ctx)
			case 'list':
				if (!node.children) {
					// TODO: figure out how to autocomplete when there is no item node
					return []
				}
				const index = core.binarySearch(
					node.children,
					ctx.offset,
					(n, o) => core.Range.compareOffset(n.range, o, true),
				)
				const item = index >= 0 ? node.children[index] : undefined
				// TODO: don't assume the children will be ItemNode's
				if (!item || !core.ItemNode.is(item) || !item.value) {
					return []
				}
				return ctx.meta.getCompleter(item.value.type)(item.value, ctx)
			case 'string':
				// TODO: handle attributes
				return [core.CompletionItem.create('""', node.range, {
					kind: core.CompletionKind.Value,
				})]
			default:
				return []
		}
	}
}
