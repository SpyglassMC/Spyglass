import { UriBinderContext, VanillaConfig } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { dissectUri, registerCustomResources } from '../../lib/binder/index.js'

describe('dissectUri()', () => {
	const suites: { uri: string; version?: `1.${number}` }[] = [
		{ uri: 'file:///data/minecraft/loot_tables/foo.json' },
		{ uri: 'file:///data/minecraft/loot_table/foo.json', version: '1.21' },
		{ uri: 'file:///data/minecraft/tags/blocks/bar.json' },
		{ uri: 'file:///data/minecraft/tags/blocks/bar.json', version: '1.21' },
		{ uri: 'file:///data/minecraft/tags/block/bar.json' },
		{ uri: 'file:///data/minecraft/tags/block/bar.json', version: '1.21' },
		{ uri: 'file:///data/qux/dimension/foo/baz.json', version: '1.16' },
		{ uri: 'file:///data/minecraft/advancements/data/foo/predicates/bar.json' },
		{ uri: 'file:///pack.mcmeta' },
		{ uri: 'file:///data/loot_tables/foo.json' },
		{ uri: 'file:///data/minecraft/entities/foo.json' },
	]
	for (const { uri, version } of suites) {
		it(`Dissect Uri "${uri}"${version ? ' in ' + version : ''}`, () => {
			const ctx = UriBinderContext.create(
				mockProjectData({ roots: ['file:///'], ctx: { loadedVersion: version ?? '1.15' } }),
			)
			snapshot(dissectUri(uri, ctx) ?? 'undefined')
		})
	}
})

describe('dissectUri() with customResources', () => {
	const suites: { uri: string; version?: `1.${number}` }[] = [
		{ uri: 'file:///data/minecraft/loot_tables/foo.json' },
		{ uri: 'file:///data/minecraft/advancement/foo.json', version: '1.21' },
		{ uri: 'file:///data/qux/biome_modifiers/snowy.json' },
		{ uri: 'file:///data/qux/tags/custom_registry/nested/bar.json' },
	]
	for (const { uri, version } of suites) {
		it(`Dissect Uri "${uri}"${version ? ' in ' + version : ''}`, () => {
			const ctx = UriBinderContext.create(
				mockProjectData({
					config: {
						...VanillaConfig,
						env: {
							...VanillaConfig.env,
							customResources: {
								'biome_modifiers': { category: 'fabric:biome_modifier' },
								'tags/custom_registry': { category: 'tag/custom_registry' },
							},
						},
					},
					roots: ['file:///'],
					ctx: { loadedVersion: version ?? '1.15' },
				}),
			)
			registerCustomResources(ctx.config)
			snapshot(dissectUri(uri, ctx) ?? 'undefined')
		})
	}
})
