import type * as core from '@spyglassmc/core'
import type { McdocType } from '../../type/index.js'

export function getFields(typeDef: core.DeepReadonly<McdocType>) {
	if (typeDef.kind !== 'struct') return []
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
}
