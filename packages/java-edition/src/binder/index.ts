import type {
	CheckerContext,
	Config,
	FileCategory,
	RootUriString,
	TaggableResourceLocationCategory,
	UriBinder,
	UriBinderContext,
} from '@spyglassmc/core'
import {
	ErrorSeverity,
	fileUtil,
	Range,
	TaggableResourceLocationCategories,
} from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import { ReleaseVersion } from '../dependency/index.js'

interface Resource {
	path: string
	category: FileCategory
	ext: `.${string}`
	pack: 'data' | 'assets'
	since?: ReleaseVersion
	until?: ReleaseVersion
}

const Resources = new Map<string, Resource[]>()

function resource(path: string, resource: Partial<Resource> & { category: FileCategory }): void
function resource(path: FileCategory, resource: Partial<Resource>): void
function resource(path: string, resource: Partial<Resource> = {}) {
	const previous = Resources.get(path) ?? []
	Resources.set(path, [
		...previous,
		{
			path,
			category: resource.category ?? path as FileCategory,
			ext: resource.ext ?? '.json',
			pack: resource.pack ?? 'data',
			...resource,
		},
	])
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
resource('instrument', { since: '1.21.2' })
resource('jukebox_song', { since: '1.21' })
resource('painting_variant', { since: '1.21' })
resource('trial_spawner', { since: '1.21.2' })
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

// Resource pack
resource('atlases', { pack: 'assets', category: 'atlas', since: '1.19.3' })
resource('blockstates', { pack: 'assets', category: 'block_definition' })
resource('fonts', { pack: 'assets', category: 'font', since: '1.16' })
resource('fonts', { pack: 'assets', category: 'font/ttf', since: '1.16', ext: '.ttf' })
resource('fonts', { pack: 'assets', category: 'font/otf', since: '1.16', ext: '.otf' })
resource('fonts', { pack: 'assets', category: 'font/unihex', since: '1.20', ext: '.zip' })
resource('lang', { pack: 'assets', category: 'lang' })
resource('models', { pack: 'assets', category: 'model' })
resource('particles', { pack: 'assets', category: 'particle' })
resource('post_effect', { pack: 'assets', since: '1.21.2' })
resource('shaders/post', { pack: 'assets', category: 'post_effect', until: '1.21.2' })
resource('shaders', { pack: 'assets', category: 'shader' })
resource('shaders', { pack: 'assets', category: 'shader/fragment', ext: '.fsh' })
resource('shaders', { pack: 'assets', category: 'shader/vertex', ext: '.vsh' })
resource('sounds', { pack: 'assets', category: 'sound', ext: '.ogg' })
resource('textures', { pack: 'assets', category: 'texture', ext: '.png' })

export function* getRels(
	uri: string,
	rootUris: readonly RootUriString[],
): Generator<string, undefined, unknown> {
	yield* fileUtil.getRels(uri, rootUris)

	const parts = uri.split('/')
	for (let i = parts.length - 2; i >= 0; i--) {
		if (parts[i] === 'data' || parts[i] === 'assets') {
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
		if (parts.length < 4) {
			continue
		}
		const [pack, namespace, ...rest] = parts
		if (pack !== 'data' && pack !== 'assets') {
			continue
		}
		const candidateResources: [Resource, string][] = []
		for (let i = 1; i < rest.length; i += 1) {
			const resources = Resources.get(rest.slice(0, i).join('/'))
			for (const res of resources ?? []) {
				if (res.pack !== pack) {
					continue
				}
				let identifier = rest.slice(i).join('/')
				if (!identifier.endsWith(res.ext)) {
					continue
				}
				identifier = identifier.slice(0, -res.ext.length)
				candidateResources.push([res, identifier])
			}
		}
		if (candidateResources.length === 0) {
			continue
		}
		// Finding the last, because that will be the deepest match
		let res = candidateResources.findLast(([res]) => matchVersion(release, res.since, res.until))
		if (res !== undefined) {
			return { ok: true, ...res[0], namespace, identifier: res[1], expected: undefined }
		}
		// Try to find the expected path that matches the current version
		res = candidateResources[candidateResources.length - 1]
		let expected: string | undefined = undefined
		for (const [path, others] of Resources) {
			for (const other of others) {
				if (other.category !== res[0].category) {
					continue
				}
				if (matchVersion(release, other.since, other.until)) {
					expected = path
					break
				}
			}
		}
		return { ok: false, ...res[0], namespace, identifier: res[1], expected }
	}

	return undefined
}

export const uriBinder: UriBinder = (uris: readonly string[], ctx: UriBinderContext) => {
	for (const uri of uris) {
		const parts = dissectUri(uri, ctx)
		if (parts) {
			ctx.symbols.query(uri, parts.category, `${parts.namespace}:${parts.identifier}`).enter({
				usage: { type: 'definition' },
			})
		}
	}
}

export function registerCustomResources(config: Config) {
	for (const [path, res] of Object.entries(config.env.customResources)) {
		if (res.pack === undefined || res.pack === 'data') {
			resource(path, { ...res, category: res.category as FileCategory })
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

export function reportDissectError(
	realPath: string,
	expectedPath: string | undefined,
	ctx: CheckerContext,
) {
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	if (!release) {
		return
	}
	if (expectedPath) {
		ctx.err.report(
			localize(
				'java-edition.binder.wrong-folder',
				localeQuote(realPath),
				release,
				localeQuote(expectedPath),
			),
			Range.Beginning,
			ErrorSeverity.Hint,
		)
	} else {
		ctx.err.report(
			localize(
				'java-edition.binder.wrong-version',
				localeQuote(realPath),
				release,
			),
			Range.Beginning,
			ErrorSeverity.Hint,
		)
	}
}
