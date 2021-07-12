import { simpleString, string } from '@spyglassmc/json/lib/checker'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import type { NbtCompoundNode } from '@spyglassmc/nbt'
import { checker as nbtChecker } from '@spyglassmc/nbt'
import type { ResolvedRootRegistry } from '@spyglassmc/nbtdoc'
import { getTagValues } from '../../../common'

interface Options {
	registry: ResolvedRootRegistry,
	id?: string | undefined,
	ids?: readonly string[] | undefined,
	tag?: string | undefined,
}

export function nbt({ registry, id, ids, tag }: Options): JsonChecker {
	return (node, ctx) => {
		if (tag && (registry === 'block' || registry === 'item' || registry === 'entity_type')) {
			ids = getTagValues(`tag/${registry}`, tag, ctx)
		} else if (id) {
			ids = [id]
		}
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ids?.length || !ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		const parser = ctx.meta.getParserLazily<NbtCompoundNode>('nbt:compound')
		const checker = nbtChecker.index(registry, ids[0])
		string('nbt', parser, checker)(node, ctx)
	}
}
