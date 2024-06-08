import type * as core from '@spyglassmc/core'
import type { AttributeValue, McdocType } from '../../type/index.js'

export interface McdocAttribute<C = unknown> {
	config: (value: AttributeValue | undefined) => C | undefined
}

export function registerAttribute<C>(
	meta: core.MetaRegistry,
	name: string,
	attribute: McdocAttribute<C>,
) {
	meta.registerCustom('mcdoc:attribute', name, attribute)
}

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute<string>(meta, 'id', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		// TODO: implement id attribute
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
