import type {
	FileCategory,
	RootUriString,
	TaggableResourceLocationCategory,
	UriBinder,
	UriBinderContext,
} from '@spyglassmc/core'
import { fileUtil, TaggableResourceLocationCategories } from '@spyglassmc/core'
import { ReleaseVersion } from '../dependency/index.js'

interface Resource {
	path: string
	category: FileCategory
	ext: `.${string}`
	since?: ReleaseVersion
	until?: ReleaseVersion
}

interface ResourceTree {
	children: Map<string, ResourceTree>
	resource?: Resource
}

const rootNode: ResourceTree = { children: new Map() }

function findResource(parts: string[]) {
	let node: ResourceTree | undefined = rootNode
	let resource: Resource | undefined = undefined
	let matchIndex = 0
	for (let i = 0; i < parts.length; i += 1) {
		node = node.children.get(parts[i])
		if (node === undefined) {
			break
		}
		if (node.resource) {
			resource = node.resource
			matchIndex = i + 1
		}
	}
	return {
		resource,
		path: parts.slice(matchIndex),
	}
}

function resource(path: string, resource: Partial<Resource> & { category: FileCategory }): void
function resource(path: FileCategory, resource: Partial<Resource>): void
function resource(path: string, resource: Partial<Resource> = {}) {
	let node: ResourceTree | undefined = rootNode
	for (const part of path.split('/')) {
		let child: ResourceTree | undefined = node.children.get(part)
		if (child === undefined) {
			child = { children: new Map() }
			node.children.set(part, child)
		}
		node = child
	}
	node.resource = {
		path,
		category: resource.category ?? path as FileCategory,
		ext: resource.ext ?? '.json',
		...resource,
	}
}

// Pre-1.21 data pack plurals
resource('advancements', { category: 'advancement', until: '1.21' })
resource('functions', { category: 'function', until: '1.21', ext: '.mcfunction' })
resource('item_modifiers', { category: 'item_modifier', since: '1.17', until: '1.21' })
resource('loot_tables', { category: 'loot_table', until: '1.21' })
resource('predicates', { category: 'predicate', until: '1.21' })
resource('recipes', { category: 'recipe', until: '1.21' })
resource('structures', { category: 'structure', until: '1.21', ext: '.nbt' })
resource('tags/blocks', { category: 'tag/block', until: '1.21' })
resource('tags/entity_types', { category: 'tag/entity_type', until: '1.21' })
resource('tags/fluids', { category: 'tag/fluid', until: '1.21' })
resource('tags/functions', { category: 'tag/function', until: '1.21' })
resource('tags/game_events', { category: 'tag/game_event', since: '1.17', until: '1.21' })
resource('tags/items', { category: 'tag/item', until: '1.21' })

// Post-1.21 data pack non-plurals
resource('advancement', { since: '1.21' })
resource('function', { since: '1.21', ext: '.mcfunction' })
resource('item_modifier', { since: '1.21' })
resource('loot_table', { since: '1.21' })
resource('predicate', { since: '1.21' })
resource('recipe', { since: '1.21' })
resource('structure', { since: '1.21', ext: '.nbt' })
resource('tags/block', { category: 'tag/block', since: '1.21' })
resource('tags/entity_type', { category: 'tag/entity_type', since: '1.21' })
resource('tags/fluid', { category: 'tag/fluid', since: '1.21' })
resource('tags/function', { category: 'tag/function', since: '1.21' })
resource('tags/game_event', { category: 'tag/game_event', since: '1.21' })
resource('tags/item', { category: 'tag/item', since: '1.21' })

// Data pack
resource('banner_pattern', { since: '1.20.5' })
resource('chat_type', { since: '1.19' })
resource('damage_type', { since: '1.19.4' })
resource('enchantment', { since: '1.21' })
resource('enchantment_provider', { since: '1.21' })
resource('jukebox_song', { since: '1.21' })
resource('painting_variant', { since: '1.21' })
resource('trim_pattern', { since: '1.19.4' })
resource('trim_material', { since: '1.19.4' })
resource('wolf_variant', { since: '1.20.5' })

// Worldgen
resource('dimension', { since: '1.16' })
resource('dimension_type', { since: '1.16' })
resource('worldgen/biome', { since: '1.16.2' })
resource('worldgen/configured_carver', { since: '1.16.2' })
resource('worldgen/configured_feature', { since: '1.16.2' })
resource('worldgen/configured_structure_feature', { since: '1.16.2', until: '1.19' })
resource('worldgen/density_function', { since: '1.18.2' })
resource('worldgen/flat_level_generator_preset', { since: '1.19' })
resource('worldgen/multi_noise_biome_source_parameter_list', { since: '1.19.4' })
resource('worldgen/noise', { since: '1.18' })
resource('worldgen/noise_settings', { since: '1.16.2' })
resource('worldgen/placed_feature', { since: '1.18' })
resource('worldgen/processor_list', { since: '1.16.2' })
resource('worldgen/configured_surface_builder', { since: '1.16.2', until: '1.18' })
resource('worldgen/structure', { since: '1.19' })
resource('worldgen/structure_set', { since: '1.18.2' })
resource('worldgen/template_pool', { since: '1.16.2' })
resource('worldgen/world_preset', { since: '1.19' })

// Tags
const NonTaggableRegistries = new Set<TaggableResourceLocationCategory>([
	// Legacy plural paths
	'block',
	'fluid',
	'function',
	'game_event',
	'item',
	// Removed before 1.18
	'worldgen/block_placer_type',
	'worldgen/surface_builder',
])
for (const registry of TaggableResourceLocationCategories) {
	if (NonTaggableRegistries.has(registry)) {
		continue
	}
	resource(`tags/${registry}`, { category: `tag/${registry}`, since: '1.18' })
}

export function* getRels(
	uri: string,
	rootUris: readonly RootUriString[],
): Generator<string, undefined, unknown> {
	yield* fileUtil.getRels(uri, rootUris)

	const parts = uri.split('/')
	for (let i = parts.length - 2; i >= 0; i--) {
		if (parts[i] === 'data') { // TODO: support assets
			yield parts.slice(i).join('/')
		}
	}

	return undefined
}

export function dissectUri(uri: string, ctx: UriBinderContext) {
	const rels = getRels(uri, ctx.roots)
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	if (!release) {
		return undefined
	}

	for (const rel of rels) {
		const parts = rel.split('/')
		const [pack, namespace, ...rest] = parts
		if (pack !== 'data') {
			continue // TODO: support assets
		}
		const { resource, path } = findResource(rest)
		if (!resource || path.length === 0) {
			continue
		}
		let identifier = path.join('/')
		if (!identifier.endsWith(resource.ext)) {
			continue
		}
		identifier = identifier.slice(0, -resource.ext.length)
		if (!matchVersion(release, resource.since, resource.until)) {
			continue
		}
		return { category: resource.category, namespace, identifier }
	}

	return undefined
}

export const uriBinder: UriBinder = (uris: readonly string[], ctx: UriBinderContext) => {
	for (const [path, config] of Object.entries(ctx.config.env.customResources)) {
		if (config.pack === 'data') {
			resource(path, { ...config, category: config.category as FileCategory })
		}
	}

	for (const uri of uris) {
		const parts = dissectUri(uri, ctx)
		if (parts) {
			ctx.symbols.query(uri, parts.category, `${parts.namespace}:${parts.identifier}`).enter({
				usage: { type: 'definition' },
			})
		}
	}
}

function matchVersion(
	target: ReleaseVersion,
	since: ReleaseVersion | undefined,
	until: ReleaseVersion | undefined,
): boolean {
	if (since && ReleaseVersion.cmp(target, since) < 0) {
		return false
	}
	if (until && ReleaseVersion.cmp(until, target) <= 0) {
		return false
	}
	return true
}
