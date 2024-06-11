import * as core from '@spyglassmc/core'
import type { AttributeValue } from '../../type/index.js'

export type McdocAttributeValidator<C extends core.Returnable> = (
	value: core.DeepReadonly<AttributeValue>,
	ctx: core.ContextBase,
) => core.Result<C>

export const string: McdocAttributeValidator<string> = (value) => {
	if (value.kind === 'literal' && value.value.kind === 'string') {
		return value.value.value
	}
	if (value.kind === 'reference' && value.path) {
		return value.path.replace(/.*::/, '')
	}
	return core.Failure
}

export function optional<C extends core.Returnable>(
	validator: McdocAttributeValidator<C>,
): McdocAttributeValidator<C | undefined> {
	return (value, ctx) => {
		const config = validator(value, ctx)
		return config === core.Failure ? undefined : config
	}
}

export function map<C extends core.Returnable, D extends core.Returnable>(
	validator: McdocAttributeValidator<C>,
	mapper: (value: C) => D,
): McdocAttributeValidator<D> {
	return (value, ctx) => {
		const config = validator(value, ctx)
		return config === core.Failure ? core.Failure : mapper(config)
	}
}
