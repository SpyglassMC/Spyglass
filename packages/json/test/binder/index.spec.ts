import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { dissectUri } from '../../lib/binder'

describe('dissectUri()', () => {
	const suites: { uri: string }[] = [
		{ uri: 'data/minecraft/loot_tables/foo.json' },
		{ uri: 'data/minecraft/tags/blocks/bar.json' },
		{ uri: 'data/qux/dimension/foo/baz.json' },
		{ uri: 'data/minecraft/advancements/data/foo/predicates/bar.json' },
		{ uri: 'pack.mcmeta' },
		{ uri: 'data/loot_tables/foo.json' },
		{ uri: 'data/minecraft/entities/foo.json' },
	]
	for (const { uri } of suites) {
		it(`Dissect Uri "${uri}"`, () => {
			snapshot(dissectUri(uri) ?? 'null')
		})
	}
})
