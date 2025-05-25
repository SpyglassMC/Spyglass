import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { TypedNbtNode } from './node/index.js'
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
		stringParser: (config) =>
			makeInfallible(
				core.map(entry, res => ({
					type: 'nbt:typed',
					range: res.range,
					children: [res],
					targetType: config as core.Mutable<mcdoc.McdocType>,
				} satisfies TypedNbtNode)),
				localize('nbt.node'),
			),
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
