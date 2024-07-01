import * as core from '@spyglassmc/core'
import type { SimplifiedMcdocTypeNoUnion } from '../checker/index.js'
import { registerAttribute, validator } from './index.js'

interface IdConfig {
	registry?: string
	tags?: 'allowed' | 'implicit' | 'required'
	definition?: boolean
	prefix?: '!'
}

const idValidator = validator.alternatives<IdConfig>(
	validator.map(validator.string, v => ({ registry: v })),
	validator.tree({
		registry: validator.string,
		tags: validator.optional(validator.options('allowed', 'implicit', 'required')),
		definition: validator.optional(validator.boolean),
		prefix: validator.optional(validator.options('!')),
	}),
	() => ({}),
)

function getResourceLocationOptions(
	{ registry, tags, definition }: IdConfig,
	requireCanonical: boolean,
	ctx: core.ContextBase,
	typeDef?: core.DeepReadonly<SimplifiedMcdocTypeNoUnion>,
): core.ResourceLocationOptions | undefined {
	if (!registry) {
		if (typeDef?.kind === 'enum' && typeDef.enumKind === 'string') {
			return {
				pool: typeDef.values.map(v => core.ResourceLocation.lengthen(`${v.value}`)),
				allowUnknown: true, // the mcdoc checker will already report errors for this
			}
		}
		if (typeDef?.kind === 'literal' && typeDef.value.kind === 'string') {
			return {
				pool: [core.ResourceLocation.lengthen(typeDef.value.value)],
				allowUnknown: true,
			}
		}
		return { pool: [], allowUnknown: true }
	}
	if (tags === 'implicit') {
		registry = `tag/${registry}`
	}
	if (tags === 'allowed' || tags === 'required') {
		if (core.TaggableResourceLocationCategory.is(registry)) {
			return {
				category: registry,
				requireCanonical,
				allowTag: true,
				requireTag: tags === 'required',
			}
		}
	} else if (core.ResourceLocationCategory.is(registry)) {
		return {
			category: registry,
			requireCanonical,
			usageType: definition ? 'definition' : 'reference',
		}
	}
	ctx.logger.warn(`[mcdoc id] Unhandled registry ${registry}`)
	return undefined
}

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute(meta, 'canonical', () => undefined, {
		// Has hardcoded behavior in the runtime checker
	})
	registerAttribute(meta, 'dispatcher_key', validator.string, {
		stringMocker: (config, _, ctx) => {
			const symbol = ctx.symbols.query(ctx.doc, 'mcdoc/dispatcher', config).symbol
			const keys = Object.keys(symbol?.members ?? {}).filter(m => !m.startsWith('%'))
			return core.LiteralNode.mock(ctx.offset, { pool: keys })
		},
	})
	registerAttribute(meta, 'id', idValidator, {
		checkInferred: (config, inferred, ctx) => {
			if (inferred.kind === 'string') {
				// Internal mcdoc isAssignable check
				const idAttr = inferred.attributes?.find(a => a.name === 'id')
				if (idAttr) {
					const inferredConfig = idValidator(idAttr.value, ctx)
					return inferredConfig === core.Failure || inferredConfig.prefix === config.prefix
					// Prefix doesn't match
				}
			}
			if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
				return true // Ignore attribute when not a string
			}
			if (config.prefix && !inferred.value.value.startsWith(config.prefix)) {
				return false // Missing prefix
			}
			if (!config.prefix && inferred.value.value.startsWith('!')) {
				return false // Unexpected prefix
			}
			if (!inferred.value.value.includes(':')) {
				if (config.prefix) {
					inferred.value.value = config.prefix + 'minecraft:'
						+ inferred.value.value.slice(config.prefix.length)
				} else {
					inferred.value.value = 'minecraft:' + inferred.value.value
				}
			}
			return true
		},
		mapType: (config, typeDef, ctx) => {
			if (typeDef.kind === 'literal' && typeDef.value.kind === 'string') {
				const value = core.ResourceLocation.lengthen(typeDef.value.value)
				return { ...typeDef, value: { kind: 'string', value } }
			}
			if (typeDef.kind === 'enum' && typeDef.enumKind === 'string') {
				const values = typeDef.values.map(v => ({
					...v,
					value: core.ResourceLocation.lengthen(`${v.value}`),
				}))
				return { ...typeDef, values }
			}
			return typeDef
		},
		stringParser: (config, typeDef, ctx) => {
			const options = getResourceLocationOptions(config, ctx.requireCanonical, ctx, typeDef)
			if (!options) {
				return
			}
			const resourceLocation = core.resourceLocation(options)
			return (src, ctx) => {
				if (config.prefix) {
					return core.prefixed({ prefix: config.prefix, child: resourceLocation })(src, ctx)
				}
				return resourceLocation(src, ctx)
			}
		},
		stringMocker: (config, typeDef, ctx) => {
			const options = getResourceLocationOptions(
				config,
				ctx.requireCanonical ?? false,
				ctx,
				typeDef,
			)
			if (!options) {
				return undefined
			}
			const resourceLocation = core.ResourceLocationNode.mock(ctx.offset, options)
			if (config.prefix) {
				return core.PrefixedNode.mock(ctx.offset, config.prefix, resourceLocation)
			}
			return resourceLocation
		},
	})
}
