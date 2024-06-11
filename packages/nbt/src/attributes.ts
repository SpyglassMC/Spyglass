import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import { entry } from './parser/entry.js'

const nbtValidator: mcdoc.runtime.attribute.validator.McdocAttributeValidator<
	core.DeepReadonly<mcdoc.McdocType>
> = (value) => {
	if (!value || value?.kind === 'tree') {
		return core.Failure
	}
	return value
}

export function registerMcdocAttributes(meta: core.MetaRegistry) {
	// TODO: run the nbt checker
	mcdoc.runtime.registerAttribute(meta, 'nbt', nbtValidator, {
		attachString: (config, ctx) => {
			return (node) => {
				const src = new core.Source(node.value, node.valueMap)
				const nbt = entry(src, ctx)
				if (nbt === core.Failure) {
					ctx.err.report(
						localize('expected', localize('nbt.node')),
						node,
					)
					return
				}
				if (src.canRead()) {
					ctx.err.report(
						localize('mcdoc.runtime.checker.trailing'),
						core.Range.create(src.cursor, src.skipRemaining()),
					)
				}
				node.children = [nbt]
			}
		},
	})
}
