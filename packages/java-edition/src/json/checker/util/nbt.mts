import type { FullResourceLocation } from '@spyglassmc/core'
import { ResourceLocation } from '@spyglassmc/core'
import { simpleString, string } from '@spyglassmc/json/lib/checker/index.mjs'
import type { JsonChecker, JsonCheckerContext } from '@spyglassmc/json/lib/checker/JsonChecker.mjs'
import type { NbtCompoundNode, NbtPathNode } from '@spyglassmc/nbt'
import { checker as nbtChecker } from '@spyglassmc/nbt'
import { getTagValues } from '../../../common/index.mjs'

interface DefinitionOptions {
	definition: `::${string}::${string}`,
}
interface RegistryOptions {
	registry: string,
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

function isDefinitionOptions(options: Options): options is DefinitionOptions {
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

function registryNbt(options: RegistryOptions): JsonChecker {
	return (node, ctx) => {
		const ids = getIds(options, ctx)
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		const parser = ctx.meta.getParser<NbtCompoundNode>('nbt:compound')
		const checker = nbtChecker.index(options.registry, ids)
		string('nbt', parser, checker)(node, ctx)
	}
}

export function nbtPath(options: RegistryOptions): JsonChecker {
	return (node, ctx) => {
		const ids = getIds(options, ctx)
		// FIXME: Temporary solution to make tests pass when ensureChecked is not given.
		if (!ctx.ensureChecked) {
			simpleString(node, ctx)
			return
		}
		const parser = ctx.meta.getParser<NbtPathNode>('nbt:path')
		const checker = nbtChecker.path(options.registry, ids)
		string('nbt_path', parser, checker)(node, ctx)
	}
}

function getIds({ registry, id, idOrTag, ids, tag }: RegistryOptions, ctx: JsonCheckerContext): FullResourceLocation[] | undefined {
	if (idOrTag) {
		idOrTag.startsWith('#') ? tag = idOrTag.slice(1) : id = idOrTag
	}
	if (tag && (registry === 'block' || registry === 'item' || registry === 'entity_type')) {
		ids = getTagValues(`tag/${registry}`, tag, ctx)
	} else if (id) {
		ids = [id]
	}
	return ids?.map(ResourceLocation.lengthen)
}
