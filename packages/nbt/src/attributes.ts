import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
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
	// TODO: run the nbt checker
	mcdoc.runtime.registerAttribute(meta, 'nbt', nbtValidator, {
		stringParser: (config) => makeInfallible(entry, localize('nbt.node')),
	})
	mcdoc.runtime.registerAttribute(meta, 'nbt_path', nbtValidator, {
		stringParser: (config) => makeInfallible(path, localize('nbt.path')),
	})
}

function makeInfallible(
	parser: core.Parser,
	message: string,
): core.InfallibleParser<core.AstNode | undefined> {
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
