import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { SimplifiedMcdocTypeNoUnion } from '../checker/index.js'
import { registerAttribute, validator } from './index.js'

interface IdConfig {
	registry?: string
	tags?: 'allowed' | 'implicit' | 'required'
	definition?: boolean
	prefix?: '!'
	path?: string
	empty?: 'allowed'
	exclude?: string[]
}

const idValidator = validator.alternatives<IdConfig>(
	validator.map(validator.string, v => ({ registry: v })),
	validator.tree({
		registry: validator.string,
		tags: validator.optional(validator.options('allowed', 'implicit', 'required')),
		definition: validator.optional(validator.boolean),
		prefix: validator.optional(validator.options('!')),
		path: validator.optional(validator.string),
		empty: validator.optional(validator.options('allowed')),
		exclude: validator.optional(validator.alternatives<string[]>(
			validator.map(validator.string, v => [v]),
			(value) => {
				if (value?.kind === 'tuple') {
					return value.items.flatMap(i =>
						i.kind === 'literal' && i.value.kind === 'string' ? [i.value.value] : []
					)
				}
				return core.Failure
			},
		)),
	}),
	() => ({}),
)

function getResourceLocationOptions(
	{ registry, tags, definition, path }: IdConfig,
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
				implicitPath: path,
			}
		}
	} else if (core.ResourceLocationCategory.is(registry)) {
		return {
			category: registry,
			requireCanonical,
			usageType: definition ? 'definition' : 'reference',
			implicitPath: path,
		}
	}
	ctx.logger.warn(`[mcdoc id] Unhandled registry ${registry}`)
	return undefined
}

interface IntegerConfig {
	min?: number
	max?: number
}
const integerValidator = validator.alternatives<IntegerConfig>(
	validator.tree({
		min: validator.optional(validator.number),
		max: validator.optional(validator.number),
	}),
	() => ({}),
)

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
				if (config.empty && !src.canRead()) {
					return core.string({
						unquotable: { blockList: new Set(), allowEmpty: true },
					})(src, ctx)
				}
				if (config.prefix) {
					return core.prefixed({ prefix: config.prefix, child: resourceLocation })(src, ctx)
				}
				const node = resourceLocation(src, ctx)
				if (config.exclude) {
					const resourceLocation = core.ResourceLocationNode.toString(node, 'full')
					for (const e of config.exclude ?? []) {
						const excluded = core.ResourceLocation.lengthen(e)
						if (resourceLocation === excluded) {
							ctx.err.report(
								localize('not-allowed-here', localeQuote(excluded)),
								node,
								core.ErrorSeverity.Warning,
							)
						}
					}
				}
				return node
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
	registerAttribute(meta, 'integer', integerValidator, {
		stringParser: (config) => {
			return core.integer({ pattern: /^-?\d+$/, min: config.min, max: config.max })
		},
	})
	registerAttribute(meta, 'color', validator.string, {
		checkInferred: (config, inferred, ctx) => {
			if (
				config === 'hex_rgb' && inferred.kind === 'literal' && inferred.value.kind === 'string'
			) {
				return inferred.value.value.startsWith('#')
			}
			return true
		},
		checker: (config, inferred) => {
			return (node, ctx) => {
				switch (config) {
					case 'named':
						if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
							return
						}
						node.color = core.Color.fromNamed(inferred.value.value)
						return
					case 'hex_rgb':
						if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
							return
						}
						let range = node.range
						if (core.StringBaseNode.is(node) && node.quote) {
							range = core.Range.translate(range, 1, -1)
						}
						if (!inferred.value.value.startsWith('#')) {
							ctx.err.report(
								localize('expected', localeQuote('#')),
								range,
								core.ErrorSeverity.Warning,
							)
							return
						}
						node.color = {
							value: core.Color.fromHexRGB(inferred.value.value),
							format: [core.ColorFormat.HexRGB],
							range,
						}
						return
					case 'composite_rgb':
						if (inferred.kind !== 'literal' || typeof inferred.value.value !== 'number') {
							return
						}
						node.color = {
							value: core.Color.fromCompositeRGB(inferred.value.value),
							format: [core.ColorFormat.CompositeRGB],
							range: node.range,
						}
						return
					case 'composite_argb':
						if (inferred.kind !== 'literal' || typeof inferred.value.value !== 'number') {
							return
						}
						node.color = {
							value: core.Color.fromCompositeARGB(inferred.value.value),
							format: [core.ColorFormat.CompositeARGB],
							range: node.range,
						}
						return
					default:
						return
				}
			}
		},
	})
}
