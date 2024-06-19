import * as core from '@spyglassmc/core'
import type { Attribute, StructTypePairField } from '../../type/index.js'
import type {
	McdocCheckerContext,
	SimplifiedMcdocType,
	SimplifiedMcdocTypeNoUnion,
} from '../checker/index.js'
import type { McdocAttributeValidator } from './validator.js'

export * as validator from './validator.js'

export interface McdocAttribute<C = unknown> {
	checkType?: <T>(
		config: C,
		inferred: SimplifiedMcdocTypeNoUnion,
		ctx: McdocCheckerContext<T>,
	) => boolean
	mapType?: <T>(
		config: C,
		typeDef: SimplifiedMcdocType,
		ctx: McdocCheckerContext<T>,
	) => SimplifiedMcdocType
	mapField?: <T>(
		config: C,
		field: StructTypePairField,
		ctx: McdocCheckerContext<T>,
	) => StructTypePairField
	filterElement?: <T>(config: C, ctx: McdocCheckerContext<T>) => boolean
	stringParser?: <T>(
		config: C,
		typeDef: SimplifiedMcdocTypeNoUnion,
		ctx: McdocCheckerContext<T>,
	) => core.InfallibleParser<core.AstNode | undefined> | undefined
	stringMocker?: (
		config: C,
		typeDef: core.DeepReadonly<SimplifiedMcdocTypeNoUnion>,
		ctx: core.CompleterContext,
	) => core.AstNode | undefined
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

export function getAttribute(meta: core.MetaRegistry, name: string) {
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
