import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import { typeDefinition } from './checker/index.js'
import { entry } from './parser/entry.js'
import { path } from './parser/path.js'

const nbtValidator: mcdoc.runtime.attribute.validator.McdocAttributeValidator<
	core.DeepReadonly<mcdoc.McdocType>
> = (value) => {
	if (!value || value?.kind === 'tree') {
		return core.Failure
	}
	return value
}

export function registerMcdocAttributes(meta: core.MetaRegistry) {
	mcdoc.runtime.registerAttribute(meta, 'nbt', nbtValidator, {
		stringParser: (config, typeDef, ctx) => (src) => {
			const res = makeInfallible(entry, localize('nbt.node'))(src, ctx)
			if (config && res) {
				typeDefinition(config as core.Mutable<mcdoc.McdocType>)(res, ctx)
			}
			return res
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'nbt_path', nbtValidator, {
		stringParser: () => makeInfallible(path, localize('nbt.path')),
	})
}

function makeInfallible<T extends core.AstNode>(
	parser: core.Parser<T>,
	message: string,
): core.InfallibleParser<T | undefined> {
	return (src, ctx) => {
		const start = src.cursor
		const res = parser(src, ctx)
		if (res === core.Failure) {
			ctx.err.report(
				localize('expected', message),
				core.Range.create(start, src.skipRemaining()),
			)
			return undefined
		}
		return res
	}
}
