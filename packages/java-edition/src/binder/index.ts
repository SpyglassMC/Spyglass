import type {
	ContextBase,
	FileCategory,
	RootUriString,
	TagFileCategory,
	TaggableResourceLocationCategory,
	UriBinder,
	UriBinderContext,
} from '@spyglassmc/core'
import { fileUtil, TaggableResourceLocationCategories } from '@spyglassmc/core'
import { ReleaseVersion } from '../dependency/index.js'

type ScopedVersion = { since?: ReleaseVersion; until?: ReleaseVersion }

function JSONResource(
	pack: 'datapack' | 'resource_pack',
	dispatcher: FileCategory | TagFileCategory,
	pathOrVersion: string | ScopedVersion,
	version?: ScopedVersion,
) {
	let _version: ScopedVersion = {}

	if (typeof pathOrVersion !== 'string') {
		_version = pathOrVersion
	} else if (version) {
		_version = version
	}
	return [
		typeof pathOrVersion === 'string' ? pathOrVersion : dispatcher,
		{
			pack,
			category: dispatcher,
			extname: '.json',
			..._version,
		} as const,
	] as readonly [FileCategory | TagFileCategory, CategoryDef]
}

function DatapackJSON(
	dispatcher: FileCategory | TagFileCategory,
	pathOrVersion: string | ScopedVersion,
	version?: ScopedVersion,
) {
	return JSONResource('datapack', dispatcher, pathOrVersion, version)
}

// function ResourcePackJSON(
// 	dispatcher: FileCategory | TagFileCategory,
// 	pathOrVersion: string | ScopedVersion,
// 	version?: ScopedVersion,
// ) {
// 	return JSONResource('resource_pack', dispatcher, pathOrVersion, version)
// }

type CategoryDef = {
	category: FileCategory | TagFileCategory
	extname: string
	pack: 'datapack' | 'resource_pack'
} & ScopedVersion

export const Categories = (() => {
	const NonTaggableRegistries = new Set<TaggableResourceLocationCategory>([
		'block',
		'fluid',
		'function',
		'game_event',
		'item', // They have the legacy `tags/${plural}` path until 1.21.
		'worldgen/block_placer_type',
		'worldgen/surface_builder', // TODO: They are removed at some point.
	])

	const ans = new Map<string, CategoryDef>([
		// Pre-1.21
		DatapackJSON('advancement', 'advancements', {
			since: '1.16',
			until: '1.21',
		}),
		DatapackJSON('dimension', 'dimension', { since: '1.16' }),
		DatapackJSON('dimension_type', 'dimension_type', { since: '1.16' }),
		['functions', {
			category: 'function',
			extname: '.mcfunction',
			pack: 'datapack',
			until: '1.21',
		}],
		DatapackJSON('item_modifier', 'item_modifiers', {
			since: '1.17',
			until: '1.21',
		}),
		DatapackJSON('loot_table', 'loot_tables', {
			since: '1.16',
			until: '1.21',
		}),
		DatapackJSON('predicate', 'predicates', { since: '1.16', until: '1.21' }),
		DatapackJSON('recipe', 'recipes', { since: '1.16', until: '1.21' }),
		DatapackJSON('tag/block', 'tags/blocks', { until: '1.21' }),
		DatapackJSON('tag/entity_type', 'tags/entity_types', { until: '1.21' }),
		DatapackJSON('tag/fluid', 'tags/fluids', { until: '1.21' }),
		DatapackJSON('tag/function', 'tags/functions', { until: '1.21' }),
		DatapackJSON('tag/game_event', 'tags/game_events', {
			since: '1.17',
			until: '1.21',
		}),
		DatapackJSON('tag/item', 'tags/items', { until: '1.21' }),

		// Worldgen
		DatapackJSON('worldgen/biome', { since: '1.16' }),
		DatapackJSON('worldgen/configured_carver', { since: '1.16' }),
		DatapackJSON('worldgen/configured_feature', { since: '1.16' }),
		DatapackJSON('worldgen/configured_structure_feature', {
			since: '1.16',
			until: '1.17',
		}),
		DatapackJSON('worldgen/density_function', { since: '1.18' }),
		DatapackJSON('worldgen/noise', { since: '1.18' }),
		DatapackJSON('worldgen/noise_settings', { since: '1.16' }),
		DatapackJSON('worldgen/placed_feature', { since: '1.18' }),
		DatapackJSON('worldgen/processor_list', { since: '1.16' }),
		DatapackJSON('worldgen/template_pool', { since: '1.16' }),

		// Post-1.21
		DatapackJSON('advancement', { since: '1.21' }),
		['function', {
			category: 'function',
			extname: '.mcfunction',
			pack: 'datapack',
			since: '1.21',
		}],
		DatapackJSON('item_modifier', { since: '1.21' }),
		DatapackJSON('loot_table', { since: '1.21' }),
		DatapackJSON('predicate', { since: '1.21' }),
		DatapackJSON('recipe', { since: '1.21' }),
		DatapackJSON('tag/block', 'tags/block', { since: '1.21' }),
		DatapackJSON('tag/entity_type', 'tags/entity_type', { since: '1.21' }),
		DatapackJSON('tag/fluid', 'tags/fluid', { since: '1.21' }),
		DatapackJSON('tag/function', 'tags/function', { since: '1.21' }),
		DatapackJSON('tag/game_event', 'tags/game_event', { since: '1.21' }),
		DatapackJSON('tag/item', 'tags/item', { since: '1.21' }),
	])

	for (const registry of TaggableResourceLocationCategories) {
		if (NonTaggableRegistries.has(registry)) {
			continue
		}
		ans.set(`tags/${registry}`, {
			category: `tag/${registry}` as TagFileCategory,
			extname: '.json',
			pack: 'datapack',
			since: '1.18',
		})
	}

	return ans
})()

export function* getRels(
	uri: string,
	rootUris: readonly RootUriString[],
): Generator<string, undefined, unknown> {
	yield* fileUtil.getRels(uri, rootUris)

	const parts = uri.split('/')
	for (let i = parts.length - 2; i >= 0; i--) {
		if (parts[i] === 'data') {
			yield parts.slice(i).join('/')
		}
	}

	return undefined
}

export function dissectUri(uri: string, ctx: UriBinderContext) {
	const regex =
		/^data\/([^\/]+)\/((?:tags\/|worldgen\/)?[a-z_]+)\/(.*)(\.(?:mcfunction|json))$/

	const rels = getRels(uri, ctx.roots)

	const { customResources } = ctx.config.env

	if (customResources.length > 0 && ctx.project['customResourcesDefined'] === undefined) {
		ctx.project['customResourcesDefined'] = 'done'

		for (const [category, def] of customResources) {
			Categories.set(category, def as CategoryDef)
		}
	}

	for (const rel of rels) {
		const match = rel.match(regex)
		if (!match) {
			continue
		}
		let def = Categories.get(match[2])

		if (!def && customResources.length > 0) {
			// Try to match the category for custom resources.
			const subFolders = match[3].split('/').slice(0, -1)

			if (subFolders.length === 0) {
				continue
			} else {
				for (let i = 0; i < subFolders.length - 1; i++) {
					const customCategory = `${match[2]}/${
						subFolders.slice(0, i + 1).join('/')
					}`

					def = Categories.get(customCategory)

					// we don't break here because we want to find the most specific category
				}
			}
		}
		if (!def || def.extname !== match[4]) {
			continue
		}
		const loadedVersion = ctx.project['loadedVersion'] as
			| ReleaseVersion
			| undefined
		if (
			!loadedVersion || // FIXME: check why this can be undefined sometimes
			!matchVersion(loadedVersion, def.since, def.until)
		) {
			continue
		}
		return {
			category: def.category,
			namespace: match[1],
			identifier: match[3],
		}
	}

	return undefined
}

export const uriBinder: UriBinder = (
	uris: readonly string[],
	ctx: UriBinderContext,
) => {
	for (const uri of uris) {
		const parts = dissectUri(uri, ctx)
		if (parts) {
			ctx.symbols
				.query(
					uri,
					parts.category,
					`${parts.namespace}:${parts.identifier}`,
				)
				.enter({
					usage: {
						type: 'definition',
					},
				})
		}
	}
}

function matchVersion(
	target: ReleaseVersion,
	since: ReleaseVersion | undefined,
	until: ReleaseVersion | undefined,
): boolean {
	if (since && ReleaseVersion.cmp(target, since) < 0) return false
	if (until && ReleaseVersion.cmp(until, target) < 0) return false
	return true
}
