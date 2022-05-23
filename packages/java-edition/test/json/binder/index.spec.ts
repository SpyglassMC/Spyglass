import { ContextBase } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { dissectUri } from '../../../lib/binder/index.js'

describe('dissectUri()', () => {
	const ctx = ContextBase.create(mockProjectData({ roots: ['file:///'], ctx: { loadedVersion: '1.17' } }))
	const suites: { uri: string }[] = [
		{ uri: 'file:///data/minecraft/loot_tables/foo.json' },
		{ uri: 'file:///data/minecraft/tags/blocks/bar.json' },
		{ uri: 'file:///data/qux/dimension/foo/baz.json' },
		{ uri: 'file:///data/minecraft/advancements/data/foo/predicates/bar.json' },
		{ uri: 'file:///pack.mcmeta' },
		{ uri: 'file:///data/loot_tables/foo.json' },
		{ uri: 'file:///data/minecraft/entities/foo.json' },
	]
	for (const { uri } of suites) {
		it(`Dissect Uri "${uri}"`, () => {
			snapshot(dissectUri(uri, ctx) ?? 'undefined')
		})
	}
})
