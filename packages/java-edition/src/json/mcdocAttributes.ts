import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri } from '../binder/index.js'
import type { TextureSlotKind, TextureSlotNode } from './node/index.js'
import { textureSlotParser } from './parser/index.js'

const validator = mcdoc.runtime.attribute.validator

const criterionValidator = validator.alternatives(
	validator.tree({
		definition: validator.boolean,
	}),
	() => ({ definition: false }),
)

interface TextureSlotConfig {
	kind: TextureSlotKind
}
const textureSlotValidator = validator.alternatives<TextureSlotConfig>(
	validator.tree({
		kind: validator.options('definition', 'value', 'reference'),
	}),
	() => ({ kind: 'value' }),
)

const translationKeyValidator = validator.alternatives(
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
	mcdoc.runtime.registerAttribute(meta, 'texture_slot', textureSlotValidator, {
		stringParser: (config, _, ctx) => {
			return textureSlotParser(config.kind)
		},
		stringMocker: (config, _, ctx) => {
			return {
				type: 'java_edition:texture_slot',
				range: core.Range.create(ctx.offset),
				kind: config.kind,
				children: [],
			} satisfies TextureSlotNode
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'translation_key', translationKeyValidator, {
		stringParser: (config, _, ctx) => {
			return core.symbol({
				category: 'translation_key',
				usageType: config.definition ? 'definition' : 'reference',
			})
		},
		stringMocker: (config, _, ctx) => {
			return core.SymbolNode.mock(ctx.offset, {
				category: 'translation_key',
				usageType: config.definition ? 'definition' : 'reference',
			})
		},
	})
}
