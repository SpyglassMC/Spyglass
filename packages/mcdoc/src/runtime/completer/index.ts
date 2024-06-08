import type * as core from '@spyglassmc/core'
import { TypeDefSymbolData } from '../../binder/index.js'
import type { McdocType, StructTypePairField } from '../../type/index.js'

export function getFields(
	typeDef: core.DeepReadonly<McdocType>,
): { key: string; field: core.DeepReadonly<StructTypePairField> }[] {
	// TODO: handle attributes
	switch (typeDef.kind) {
		case 'union':
			return typeDef.members.flatMap(getFields)
		case 'struct':
			return typeDef.fields
				.flatMap(field => {
					if (field.kind === 'spread') return []
					if (typeof field.key === 'string') {
						return [{ key: field.key, field }]
					}
					if (field.key.kind === 'literal') {
						return [{ key: `${field.key.value.value}`, field }]
					}
					return []
				})
		default:
			return []
	}
}

export function getValues(
	typeDef: core.DeepReadonly<McdocType>,
	ctx: core.CompleterContext,
): { value: string; detail?: string; kind?: McdocType['kind'] }[] {
	// TODO: handle attributes
	switch (typeDef.kind) {
		case 'union':
			return typeDef.members.flatMap(m => getValues(m, ctx))
		case 'reference':
			if (!typeDef.path) return []
			const symbol = ctx.symbols.query(ctx.doc, 'mcdoc', typeDef.path)
			const def = symbol.getData(TypeDefSymbolData.is)?.typeDef
			if (!def) return []
			return getValues(def, ctx)
		case 'literal':
			if (typeDef.value.kind === 'string') {
				return [{ value: typeDef.value.value, kind: 'string' }]
			}
			return [{ value: `${typeDef.value.value}` }]
		case 'boolean':
			return ['false', 'true'].map(v => ({ value: v, kind: 'boolean' }))
		case 'string':
			return []
		case 'enum':
			return typeDef.values.map(v => ({
				value: `${v.value}`,
				detail: v.identifier,
				kind: typeDef.enumKind ?? 'string',
			}))
		default:
			return []
	}
}
