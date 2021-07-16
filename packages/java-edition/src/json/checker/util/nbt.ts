import { ResourceLocation } from '@spyglassmc/core'
import { simpleString, string } from '@spyglassmc/json/lib/checker'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker'
import type { NbtCompoundNode } from '@spyglassmc/nbt'
import { checker as nbtChecker } from '@spyglassmc/nbt'
import type { ExtendableRootRegistry } from '@spyglassmc/nbtdoc'
import { getTagValues } from '../../../common'

interface DefinitionOptions {
	definition: `::${string}::${string}`,
}
interface RegistryOptions {
	registry: ExtendableRootRegistry,
	id?: string | undefined,
	idOrTag?: string | undefined,
	ids?: readonly string[] | undefined,
	tag?: string | undefined,
}

type Options = DefinitionOptions | RegistryOptions

export function nbt(options: Options): JsonChecker {
	if (isDefinitionOptions(options)) {
		return definitionNbt(options)
	} else {
		return registryNbt(options)
	}
}

function isDefinitionOptions(options:Options): options is DefinitionOptions {
	return typeof (options as DefinitionOptions).definition === 'string'
}

function definitionNbt({ definition }: DefinitionOptions): JsonChecker {
	return (node, ctx) => {
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		const parser = ctx.meta.getParserLazily<NbtCompoundNode>('nbt:compound')
		const checker = nbtChecker.definition(definition)
		string('nbt', parser, checker)(node, ctx)
	}
}

function registryNbt({ registry, id, idOrTag, ids, tag }: RegistryOptions): JsonChecker {
	return (node, ctx) => {
		if (idOrTag) {
			idOrTag.startsWith('#') ? tag = idOrTag.slice(1) : id = idOrTag
		}
		if (tag && (registry === 'block' || registry === 'item' || registry === 'entity_type')) {
			ids = getTagValues(`tag/${registry}`, tag, ctx)
		} else if (id) {
			ids = [id]
		}
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		const parser = ctx.meta.getParserLazily<NbtCompoundNode>('nbt:compound')
		const checker = nbtChecker.index(registry, ids?.map(ResourceLocation.lengthen))
		string('nbt', parser, checker)(node, ctx)
	}
}
