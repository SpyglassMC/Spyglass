import * as core from '@spyglassmc/core'
import type { AttributeValue } from '../../type/index.js'

export type McdocAttributeValidator<C extends core.Returnable> = (
	value: core.DeepReadonly<AttributeValue> | undefined,
	ctx: core.ContextBase,
) => core.Result<C>

export const string: McdocAttributeValidator<string> = (value) => {
	if (value === undefined) {
		return core.Failure
	}
	if (value.kind === 'literal' && value.value.kind === 'string') {
		return value.value.value
	}
	if (value.kind === 'reference' && value.path) {
		return value.path.replace(/.*::/, '')
	}
	return core.Failure
}

export const boolean: McdocAttributeValidator<boolean> = (value) => {
	if (value === undefined) {
		return core.Failure
	}
	if (value.kind === 'literal' && value.value.kind === 'boolean') {
		return value.value.value
	}
	return core.Failure
}

export function options<C extends string>(
	...options: C[]
): McdocAttributeValidator<C> {
	return (value, ctx) => {
		const stringValue = string(value, ctx)
		if (stringValue === core.Failure) {
			return core.Failure
		}
		if ((options as string[]).includes(stringValue)) {
			return stringValue as C
		}
		return core.Failure
	}
}

export function tree<C extends { [K in keyof C]: core.Returnable }>(
	properties: { [K in keyof C]: McdocAttributeValidator<C[K]> },
): McdocAttributeValidator<C> {
	return (value, ctx) => {
		if (value?.kind !== 'tree') {
			return core.Failure
		}
		const result: Partial<C> = {}
		for (const key in properties) {
			const validator = properties[key]
			const propValue = value.values[key]
			const property = validator(propValue, ctx)
			if (property === core.Failure) {
				return core.Failure
			}
			result[key] = property
		}
		return result as C
	}
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
	mapper: (value: C) => D | typeof core.Failure,
): McdocAttributeValidator<D> {
	return (value, ctx) => {
		const config = validator(value, ctx)
		return config === core.Failure ? core.Failure : mapper(config)
	}
}

export function alternatives<C extends core.Returnable>(
	...validators: McdocAttributeValidator<C>[]
): McdocAttributeValidator<C> {
	return (value, ctx) => {
		for (const validator of validators) {
			const result = validator(value, ctx)
			if (result !== core.Failure) {
				return result
			}
		}
		return core.Failure
	}
}
