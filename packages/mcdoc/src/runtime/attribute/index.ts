import * as core from '@spyglassmc/core'
import type { Attribute, StructTypePairField } from '../../type/index.js'
import type { SimplifiedMcdocTypeNoUnion } from '../checker/index.js'
import type { SimpleCompletionValue } from '../completer/index.js'
import type { McdocAttributeValidator } from './validator.js'

export * as validator from './validator.js'

export interface McdocAttribute<C = unknown> {
	checkInferred?: (
		config: C,
		inferred: SimplifiedMcdocTypeNoUnion,
		ctx: core.CheckerContext,
	) => boolean
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

export function registerAttribute<C extends core.Returnable>(
	meta: core.MetaRegistry,
	name: string,
	validator: McdocAttributeValidator<C>,
	attribute: McdocAttribute<C>,
) {
	meta.registerCustom('mcdoc:attribute', name, { validator, attribute })
}

interface AttributeInfo {
	validator: McdocAttributeValidator<core.Returnable>
	attribute: McdocAttribute
}

export function getAttribute(
	meta: core.MetaRegistry,
	name: string,
) {
	return meta.getCustom<AttributeInfo>('mcdoc:attribute')?.get(name)
}

export function handleAttributes(
	attributes: core.DeepReadonly<Attribute[]> | undefined,
	ctx: core.ContextBase,
	fn: <C>(handler: McdocAttribute<C>, config: C) => void,
) {
	for (const { name, value } of attributes ?? []) {
		const handler = getAttribute(ctx.meta, name)
		if (!handler) {
			continue
		}

		const config = handler.validator(value, ctx)
		if (config === core.Failure) {
			continue
		}
		fn(handler.attribute, config)
	}
}
