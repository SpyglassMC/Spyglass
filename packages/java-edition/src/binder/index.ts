import type { ContextBase, FileCategory, RootUriString, UriBinder, UriBinderContext } from '@spyglassmc/core'
import { fileUtil } from '@spyglassmc/core'
import type { MajorVersion } from '../dependency'
import { MajorVersions } from '../dependency'

export const Categories = new Map<string, {
	category: FileCategory,
	extname: string,
	since?: MajorVersion,
	until?: MajorVersion,
}>([
	['advancements', { category: 'advancement', extname: '.json' }],
	['dimension', { category: 'dimension', extname: '.json', since: '1.16' }],
	['dimension_type', { category: 'dimension_type', extname: '.json', since: '1.16' }],
	['functions', { category: 'function', extname: '.mcfunction' }],
	['item_modifiers', { category: 'item_modifier', extname: '.json', since: '1.17' }],
	['loot_tables', { category: 'loot_table', extname: '.json' }],
	['predicates', { category: 'predicate', extname: '.json' }],
	['recipes', { category: 'recipe', extname: '.json' }],
	['tags/blocks', { category: 'tag/block', extname: '.json' }],
	['tags/entity_types', { category: 'tag/entity_type', extname: '.json' }],
	['tags/fluids', { category: 'tag/fluid', extname: '.json' }],
	['tags/functions', { category: 'tag/function', extname: '.json' }],
	['tags/game_events', { category: 'tag/game_event', extname: '.json', since: '1.17' }],
	['tags/items', { category: 'tag/item', extname: '.json' }],
	['worldgen/biome', { category: 'worldgen/biome', extname: '.json', since: '1.16' }],
	['worldgen/configured_carver', { category: 'worldgen/configured_carver', extname: '.json', since: '1.16' }],
	['worldgen/configured_feature', { category: 'worldgen/configured_feature', extname: '.json', since: '1.16' }],
	['worldgen/configured_structure_feature', { category: 'worldgen/configured_structure_feature', extname: '.json', since: '1.16' }],
	['worldgen/configured_surface_builder', { category: 'worldgen/configured_surface_builder', extname: '.json', since: '1.16' }],
	['worldgen/noise_settings', { category: 'worldgen/noise_settings', extname: '.json', since: '1.16' }],
	['worldgen/processor_list', { category: 'worldgen/processor_list', extname: '.json', since: '1.16' }],
	['worldgen/template_pool', { category: 'worldgen/template_pool', extname: '.json', since: '1.16' }],
])

export function* getRels(uri: string, rootUris: readonly RootUriString[]): Generator<string, undefined, unknown> {
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
	const regex = /^data\/([^\/]+)\/((?:tags\/|worldgen\/)?[a-z_]+)\/(.*)(\.(?:mcfunction|json))$/

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
		if (!matchVersion(ctx.project['loadedVersion'], def.since, def.until)) {
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

export const uriBinder: UriBinder = (uris: readonly string[], ctx: UriBinderContext) => {
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

function matchVersion(target: string, since: MajorVersion | undefined, until: MajorVersion | undefined): boolean {
	const targetIndex = MajorVersions.indexOf(target as MajorVersion)
	if (since && targetIndex < MajorVersions.indexOf(since)) return false
	if (until && targetIndex > MajorVersions.indexOf(until)) return false
	return true
}
