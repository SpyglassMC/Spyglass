import { UriBinderContext } from '@spyglassmc/core'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { uriBinder } from '../../lib/binder/uriBinder'

describe('uriBinder()', () => {
	const suites: { uris: string[] }[] = [
		{
			uris: [
				'file:///a.nbtdoc',
				'file:///root/minecraft/foo.nbtdoc',
				'file:///root/minecraft/bar.nbtdoc',
				'file:///root/minecraft/qux.mcfunction',
			],
		},
		{
			uris: [
				'file:///root/mod.nbtdoc',
				'file:///root/minecraft/mod.nbtdoc',
				'file:///root/minecraft/foo/mod.nbtdoc',
			],
		},
		{
			uris: [
				'file:///root/qux.nbtdoc',
				'file:///root/nbtdoc/foo.nbtdoc',
				'file:///root/nbtdoc/minecraft/bar.nbtdoc',
			],
		},
		{
			uris: [
				'file:///root/qux.nbtdoc',
				'file:///root/nbtdoc/mod.nbtdoc',
				'file:///root/nbtdoc/foo.nbtdoc',
				'file:///root/nbtdoc/minecraft/bar.nbtdoc',
			],
		},
	]
	for (const { uris } of suites) {
		it(`Bind ${JSON.stringify(uris.map(u => u.startsWith('file:///root/') ? u.slice('file:///root/'.length) : u))}`, () => {
			const ctx = UriBinderContext.create({ roots: ['file:///root/'] })
			uriBinder(uris, ctx)
			snapshot(ctx.symbols.global)
		})
	}
})
