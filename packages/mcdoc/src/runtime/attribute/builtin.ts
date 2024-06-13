import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { registerAttribute, validator } from './index.js'

interface IdConfig {
	registry: string
	tags?: 'allowed' | 'implicit' | 'required'
	definition?: boolean
}

// TODO: parse the resource location even without a category
const idValidator = validator.alternatives<IdConfig>(
	validator.map(
		validator.string,
		v => ({ registry: v }),
	),
	validator.tree({
		registry: validator.string,
		tags: validator.optional(
			validator.options('allowed', 'implicit', 'required'),
		),
		definition: validator.optional(
			validator.boolean,
		),
	}),
)

function getResourceLocationOptions(
	{ registry, tags, definition }: IdConfig,
	ctx: core.ContextBase,
): core.ResourceLocationOptions | undefined {
	if (tags === 'implicit') {
		registry = `tag/${registry}`
	}
	// TODO: disallow non-tags when tags=required
	if (tags === 'allowed' || tags === 'required') {
		if (core.TaggableResourceLocationCategory.is(registry)) {
			return { category: registry, allowTag: true }
		}
	} else if (core.ResourceLocationCategory.is(registry)) {
		return {
			category: registry,
			usageType: definition ? 'definition' : 'reference',
		}
	}
	ctx.logger.warn(`[mcdoc id] Unhandled registry ${registry}`)
	return undefined
}

export function registerBuiltinAttributes(meta: core.MetaRegistry) {
	registerAttribute(meta, 'id', idValidator, {
		checkInferred: (config, inferred, ctx) => {
			if (inferred.kind !== 'literal' || inferred.value.kind !== 'string') {
				return
			}
			if (!inferred.value.value.includes(':')) {
				inferred.value.value = 'minecraft:' + inferred.value.value
			}
		},
		attachString: (config, ctx) => {
			const options = getResourceLocationOptions(config, ctx)
			if (!options) {
				return
			}
			return (node) => {
				const src = new core.Source(node.value, node.valueMap)
				const id = core.resourceLocation(options)(src, ctx)
				if (src.canRead()) {
					ctx.err.report(
						localize('mcdoc.runtime.checker.trailing'),
						core.Range.create(src.cursor, src.skipRemaining()),
					)
				}
				node.children = [id]
			}
		},
		suggestValues: (config, ctx) => {
			const options = getResourceLocationOptions(config, ctx)
			if (!options) {
				return []
			}
			const mock = core.ResourceLocationNode.mock(ctx.offset, options)
			return core.completer.dispatch(mock, ctx)
				.map(item => ({
					value: item.label,
					kind: 'string',
					completionKind: core.CompletionKind.Function,
				}))
		},
	})
}
