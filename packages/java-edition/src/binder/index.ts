import type {
	ContextBase,
	FileCategory,
	RegistryCategory,
	RootUriString,
	TagFileCategory,
	UriBinder,
	UriBinderContext
} from '@spyglassmc/core'
import { fileUtil, RegistryCategories } from '@spyglassmc/core'
import { ReleaseVersion } from '../dependency/index.js'

export const Categories = (() => {
	const NonTaggableRegistries = new Set<RegistryCategory>([
		'block',
		'fluid',
		'game_event',
		'item', // They have the legacy `tags/${plural}` path.
		'worldgen/block_placer_type',
		'worldgen/surface_builder', // They are removed at some point.
	])

	const ans = new Map<
		string,
		{
			category: FileCategory
			extname: string
			since?: ReleaseVersion
			until?: ReleaseVersion
		}
	>([
		['advancements', { category: 'advancement', extname: '.json' }],
		['dimension', { category: 'dimension', extname: '.json', since: '1.16' }],
		[
			'dimension_type',
			{ category: 'dimension_type', extname: '.json', since: '1.16' },
		],
		['functions', { category: 'function', extname: '.mcfunction' }],
		[
			'item_modifiers',
			{ category: 'item_modifier', extname: '.json', since: '1.17' },
		],
		['loot_tables', { category: 'loot_table', extname: '.json' }],
		['predicates', { category: 'predicate', extname: '.json' }],
		['recipes', { category: 'recipe', extname: '.json' }],
		['tags/blocks', { category: 'tag/block', extname: '.json' }],
		['tags/entity_types', { category: 'tag/entity_type', extname: '.json' }],
		['tags/fluids', { category: 'tag/fluid', extname: '.json' }],
		['tags/functions', { category: 'tag/function', extname: '.json' }],
		[
			'tags/game_events',
			{ category: 'tag/game_event', extname: '.json', since: '1.17' },
		],
		['tags/items', { category: 'tag/item', extname: '.json' }],
		[
			'worldgen/biome',
			{ category: 'worldgen/biome', extname: '.json', since: '1.16' },
		],
		[
			'worldgen/configured_carver',
			{
				category: 'worldgen/configured_carver',
				extname: '.json',
				since: '1.16',
			},
		],
		[
			'worldgen/configured_feature',
			{
				category: 'worldgen/configured_feature',
				extname: '.json',
				since: '1.16',
			},
		],
		[
			'worldgen/configured_structure_feature',
			{
				category: 'worldgen/configured_structure_feature',
				extname: '.json',
				since: '1.16',
			},
		],
		[
			'worldgen/configured_surface_builder',
			{
				category: 'worldgen/configured_surface_builder',
				extname: '.json',
				since: '1.16',
				until: '1.17',
			},
		],
		[
			'worldgen/noise',
			{ category: 'worldgen/noise', extname: '.json', since: '1.18' },
		],
		[
			'worldgen/noise_settings',
			{ category: 'worldgen/noise_settings', extname: '.json', since: '1.16' },
		],
		[
			'worldgen/placed_feature',
			{ category: 'worldgen/placed_feature', extname: '.json', since: '1.18' },
		],
		[
			'worldgen/processor_list',
			{ category: 'worldgen/processor_list', extname: '.json', since: '1.16' },
		],
		[
			'worldgen/template_pool',
			{ category: 'worldgen/template_pool', extname: '.json', since: '1.16' },
		],
	])

	for (const registry of RegistryCategories) {
		if (NonTaggableRegistries.has(registry)) {
			continue
		}
		ans.set(`tags/${registry}`, {
			category: `tag/${registry}` as TagFileCategory,
			extname: '.json',
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

export function dissectUri(uri: string, ctx: ContextBase) {
	const regex =
		/^data\/([^\/]+)\/((?:tags\/|worldgen\/)?[a-z_]+)\/(.*)(\.(?:mcfunction|json))$/

	const rels = getRels(uri, ctx.roots)
	for (const rel of rels) {
		const match = rel.match(regex)
		if (!match) {
			continue
		}
		const def = Categories.get(match[2])
		if (!def || def.extname !== match[4]) {
			continue
		}
		const loadedVersion = ctx.project['loadedVersion'] as ReleaseVersion | undefined
		if (
			!loadedVersion || // FIXME: check why this can be undefined sometimes
			!matchVersion(
				loadedVersion,
				def.since,
				def.until,
			)
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
				.query(uri, parts.category, `${parts.namespace}:${parts.identifier}`)
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
