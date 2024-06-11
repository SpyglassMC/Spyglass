import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { registerAttribute, validator } from './index.js'

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute(meta, 'id', validator.string, {
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
			if (!core.ResourceLocationCategory.is(config)) {
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
