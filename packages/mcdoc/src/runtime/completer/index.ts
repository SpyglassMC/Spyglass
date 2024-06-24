import type * as core from '@spyglassmc/core'
import { TypeDefSymbolData } from '../../binder/index.js'
import type { LiteralType, McdocType, StringType, StructTypePairField } from '../../type/index.js'
import { handleAttributes } from '../attribute/index.js'
import type { SimplifiedEnum, SimplifiedMcdocType } from '../checker/index.js'

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
				if (
					field.key.kind === 'string'
					|| (field.key.kind === 'literal' && field.key.value.kind === 'string')
					|| (field.key.kind === 'enum' && field.key.enumKind === 'string')
				) {
					const ans = getStringCompletions(field.key, ctx)
					if (ans.length > 0) {
						return ans.map(c => ({ key: c.value, field }))
					}
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
	insertText?: string
}

// TODO: only accept SimplifiedMcdocType here
export function getValues(
	typeDef: core.DeepReadonly<McdocType>,
	ctx: core.CompleterContext,
): SimpleCompletionValue[] {
	if (
		typeDef.kind === 'string'
		|| (typeDef.kind === 'literal' && typeDef.value.kind === 'string')
		|| (typeDef.kind === 'enum' && typeDef.enumKind === 'string')
	) {
		const ans = getStringCompletions(typeDef as any, ctx)
		if (ans.length > 0) {
			return ans
		}
	}
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
			// TODO: de-duplicate this logic from the runtime simplifier
			if (!typeDef.path) {
				return []
			}
			const symbol = ctx.symbols.query(ctx.doc, 'mcdoc', typeDef.path)
			const def = symbol.getData(TypeDefSymbolData.is)?.typeDef
			if (!def) {
				return []
			}
			if (typeDef.attributes?.length) {
				return getValues({
					...def,
					attributes: [...typeDef.attributes, ...def.attributes ?? []],
				}, ctx)
			}
			return getValues(def, ctx)
		case 'literal':
			return [{ value: `${typeDef.value.value}`, kind: typeDef.value.kind }]
		case 'boolean':
			return ['false', 'true'].map(v => ({ value: v, kind: 'boolean' }))
		case 'enum':
			// TODO: de-duplicate this logic from the runtime simplifier
			const filteredValues = typeDef.values.filter(value => {
				let keep = true
				handleAttributes(value.attributes, ctx, (handler, config) => {
					if (!keep || !handler.filterElement) {
						return
					}
					if (!handler.filterElement(config, ctx)) {
						keep = false
					}
				})
				return keep
			})
			return filteredValues.map(v => ({
				value: `${v.value}`,
				detail: v.identifier,
				kind: typeDef.enumKind ?? 'string',
			}))
		default:
			return []
	}
}

function getStringCompletions(
	typeDef: core.DeepReadonly<StringType | SimplifiedEnum | LiteralType>,
	ctx: core.CompleterContext,
) {
	const ans: SimpleCompletionValue[] = []
	handleAttributes(typeDef.attributes, ctx, (handler, config) => {
		const mock = handler.stringMocker?.(config, typeDef, ctx)
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
				insertText: item.insertText,
			})),
		)
	})
	if (ans.length === 0 && typeDef.kind === 'literal') {
		ans.push({ value: `${typeDef.value.value}`, kind: 'string' })
	}
	return ans
}
