import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { AttributeValue } from '../../type/index.js'
import type {
	SimplifiedMcdocType,
	SimplifiedMcdocTypeNoUnion,
	SimplifiedStructTypePairField,
} from '../checker/index.js'

export interface McdocAttribute<C = unknown> {
	config: (value: AttributeValue | undefined) => C | undefined
	checkInferred?: (
		config: C | undefined,
		inferred: SimplifiedMcdocTypeNoUnion | SimplifiedStructTypePairField,
		ctx: core.CheckerContext,
	) => string[]
	filterElement?: (
		config: C | undefined,
		ctx: core.CheckerContext,
	) => boolean
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

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute<string>(meta, 'id', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			if (value?.kind === 'reference' && value.path) {
				return value.path.replace(/^.*::/, '')
			}
			return undefined
		},
		checkInferred: (config, inferred, ctx) => {
			if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
				return []
			}
			if (!inferred.value.value.includes(':')) {
				inferred.value.value = 'minecraft:' + inferred.value.value
			}
			if (config === undefined) return []
			const symbols = ctx.symbols.getVisibleSymbols(config, ctx.doc.uri)
			const declarations = Object.entries(symbols).flatMap((
				[key, symbol],
			) => core.SymbolUtil.isDeclared(symbol) ? [key] : [])
			if (declarations.includes(inferred.value.value)) {
				return []
			}
			return [
				localize(
					'linter.undeclared-symbol.message',
					config,
					localeQuote(inferred.value.value),
				),
			]
		},
	})
	registerAttribute<string>(meta, 'parser', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		// TODO: implement parser attribute
	})
}
