import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type {
	Attribute,
	AttributeValue,
	StructTypePairField,
} from '../../type/index.js'
import type { SimplifiedMcdocTypeNoUnion } from '../checker/index.js'
import type { SimpleCompletionValue } from '../completer/index.js'

export interface McdocAttribute<C = unknown> {
	config: (value: core.DeepReadonly<AttributeValue> | undefined) => C
	checkInferred?: (
		config: C,
		inferred: SimplifiedMcdocTypeNoUnion,
		ctx: core.CheckerContext,
	) => void
	mapField?: (
		config: C,
		field: StructTypePairField,
		ctx: core.CheckerContext,
	) => StructTypePairField
	filterElement?: (config: C, ctx: core.CheckerContext) => boolean
	attachString?: (
		config: C,
		ctx: core.CheckerContext,
	) => ((node: core.StringBaseNode) => void) | undefined
	suggestValues?: (
		config: C,
		ctx: core.CompleterContext,
	) => SimpleCompletionValue[]
}

export function registerAttribute<C>(
	meta: core.MetaRegistry,
	name: string,
	attribute: McdocAttribute<C>,
) {
	meta.registerCustom('mcdoc:attribute', name, attribute)
}

export function getAttribute(
	meta: core.MetaRegistry,
	name: string,
): McdocAttribute | undefined {
	return meta.getCustom<McdocAttribute>('mcdoc:attribute')?.get(name)
}

export function handleAttributes<T>(
	attributes: core.DeepReadonly<Attribute[]> | undefined,
	ctx: core.ContextBase,
	fn: <C>(handler: McdocAttribute<C>, config: C) => void,
) {
	for (const { name, value } of attributes ?? []) {
		const handler = getAttribute(ctx.meta, name)
		if (!handler) {
			ctx.logger.warn(`Unhandled mcdoc attribute ${name}`)
			continue
		}
		const config = handler.config(value)
		fn(handler, config)
	}
}

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute<string | undefined>(meta, 'id', {
		config: (value) => {
			// TODO: support non-string configs
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		checkInferred: (config, inferred, ctx) => {
			if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
				return
			}
			if (!inferred.value.value.includes(':')) {
				inferred.value.value = 'minecraft:' + inferred.value.value
			}
		},
		attachString: (config, ctx) => {
			// TODO: parse the resource location even without a category
			if (!config || !core.ResourceLocationCategory.is(config)) {
				return
			}
			return (node) => {
				const src = new core.Source(node.value, node.valueMap)
				const id = core.resourceLocation({ category: config })(src, ctx)
				if (src.canRead()) {
					ctx.err.report(
						localize('mcdoc.runtime.checker.trailing'),
						core.Range.create(src.cursor, src.skipRemaining()),
					)
				}
				node.children = [id]
			}
		},
		suggestValues: (config, ctx) => {
			if (config === undefined) return []
			// TODO: re-use the resource location completer
			const symbols = ctx.symbols.getVisibleSymbols(config, ctx.doc.uri)
			const declarations = Object.entries(symbols).flatMap((
				[key, symbol],
			) => core.SymbolUtil.isDeclared(symbol) ? [key] : [])
			// TODO: pass the possible doc comment from the dispatch statement as detail
			return declarations.map(value => ({ value, kind: 'string' }))
		},
	})
}
