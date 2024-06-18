import type * as core from '@spyglassmc/core'
import { TypeDefSymbolData } from '../../binder/index.js'
import type { McdocType, StringType, StructTypePairField } from '../../type/index.js'
import { handleAttributes } from '../attribute/index.js'
import type { SimplifiedMcdocType } from '../checker/index.js'

export type SimpleCompletionField = { key: string; field: core.DeepReadonly<StructTypePairField> }

export function getFields(
	typeDef: core.DeepReadonly<SimplifiedMcdocType>,
	ctx: core.CompleterContext,
): SimpleCompletionField[] {
	switch (typeDef.kind) {
		case 'union':
			const allFields = new Map<string, SimpleCompletionField>()
			for (const member of typeDef.members) {
				for (const field of getFields(member, ctx)) {
					allFields.set(field.key, field)
				}
			}
			return [...allFields.values()]
		case 'struct':
			return typeDef.fields.flatMap(field => {
				if (typeof field.key === 'string') {
					return [{ key: field.key, field }]
				}
				if (field.key.kind === 'literal') {
					return [{ key: `${field.key.value.value}`, field }]
				}
				if (field.key.kind === 'string') {
					return getStringCompletions(field.key, ctx)
						.map(c => ({ key: c.value, field }))
				}
				return []
			})
		default:
			return []
	}
}

export type SimpleCompletionValue = {
	value: string
	detail?: string
	kind?: McdocType['kind']
	completionKind?: core.CompletionKind
}

// TODO: only accept SimplifiedMcdocType here
export function getValues(
	typeDef: core.DeepReadonly<McdocType>,
	ctx: core.CompleterContext,
): SimpleCompletionValue[] {
	switch (typeDef.kind) {
		case 'union':
			const allValues = new Map<string, SimpleCompletionValue>()
			for (const member of typeDef.members) {
				for (const value of getValues(member, ctx)) {
					allValues.set(value.value, value)
				}
			}
			return [...allValues.values()]
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
			return getStringCompletions(typeDef, ctx)
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

function getStringCompletions(typeDef: core.DeepReadonly<StringType>, ctx: core.CompleterContext) {
	const ans: SimpleCompletionValue[] = []
	handleAttributes(typeDef.attributes, ctx, (handler, config) => {
		const mock = handler.stringMocker?.(config, ctx)
		if (!mock) {
			return
		}
		const items = ctx.meta.getCompleter(mock.type)(mock, ctx)
		ans.push(
			...items.map<SimpleCompletionValue>(item => ({
				value: item.label,
				kind: 'string',
				detail: item.detail,
				completionKind: item.kind,
			})),
		)
	})
	return ans
}
