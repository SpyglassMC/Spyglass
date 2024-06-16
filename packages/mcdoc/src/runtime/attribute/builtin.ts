import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
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
	ctx: core.ContextBase,
): core.ResourceLocationOptions | undefined {
	if (!registry) {
		// TODO: handle resource locations without a category
		return undefined
	}
	if (tags === 'implicit') {
		registry = `tag/${registry}`
	}
	// TODO: disallow non-tags when tags=required
	if (tags === 'allowed' || tags === 'required') {
		if (core.TaggableResourceLocationCategory.is(registry)) {
			return { category: registry, allowTag: true }
		}
	} else if (core.ResourceLocationCategory.is(registry)) {
		return { category: registry, usageType: definition ? 'definition' : 'reference' }
	}
	ctx.logger.warn(`[mcdoc id] Unhandled registry ${registry}`)
	return undefined
}

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
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
		stringParser: (config, ctx) => {
			const options = getResourceLocationOptions(config, ctx)
			if (!options) {
				return
			}
			return (src, ctx) => {
				const start = src.cursor
				if (config.prefix && !src.trySkip(config.prefix)) {
					ctx.err.report(localize('expected', localeQuote(config.prefix)), src)
				} else if (!config.prefix && src.trySkip('!')) {
					ctx.err.report(
						localize('expected-got', localize('resource-location'), localeQuote('!')),
						core.Range.create(start, src),
					)
				}
				return core.resourceLocation(options)(src, ctx)
			}
		},
		stringMocker: (config, ctx) => {
			const options = getResourceLocationOptions(config, ctx)
			if (!options) {
				return undefined
			}
			return core.ResourceLocationNode.mock(ctx.offset, options)
		},
	})
}
