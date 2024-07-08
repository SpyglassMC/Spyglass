import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri } from '../binder/index.js'

const validator = mcdoc.runtime.attribute.validator

const criterionValidator = validator.alternatives(
	validator.tree({
		definition: validator.boolean,
	}),
	() => ({ definition: false }),
)

export function registerMcdocAttributes(meta: core.MetaRegistry) {
	mcdoc.runtime.registerAttribute(meta, 'criterion', criterionValidator, {
		stringParser: (config, _, ctx) => {
			const parts = dissectUri(ctx.doc.uri, ctx)
			if (!parts || !parts.ok || parts.category !== 'advancement') {
				return undefined
			}
			return core.symbol({
				category: 'advancement',
				subcategory: 'criterion',
				parentPath: [`${parts.namespace}:${parts.identifier}`],
				usageType: config.definition ? 'definition' : 'reference',
			})
		},
		stringMocker: (config, _, ctx) => {
			const parts = dissectUri(ctx.doc.uri, ctx)
			if (!parts || !parts.ok || parts.category !== 'advancement') {
				return undefined
			}
			return core.SymbolNode.mock(ctx.offset, {
				category: 'advancement',
				subcategory: 'criterion',
				parentPath: [`${parts.namespace}:${parts.identifier}`],
			})
		},
	})
}
