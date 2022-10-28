import { SymbolFormatter, UriBinderContext } from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'
import { uriBinder } from '@spyglassmc/mcdoc/lib/uri_processors.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'

describe('mcdoc uriBinder()', () => {
	const suites: { uris: string[] }[] = [
		{
			uris: [
				'file:///a.mcdoc',
				'file:///root/minecraft/foo.mcdoc',
				'file:///root/minecraft/bar.mcdoc',
				'file:///root/minecraft/qux.mcfunction',
			],
		},
		{
			uris: [
				'file:///root/mod.mcdoc',
				'file:///root/minecraft/mod.mcdoc',
				'file:///root/minecraft/foo/mod.mcdoc',
			],
		},
		{
			uris: [
				'file:///root/qux.mcdoc',
				'file:///root/mcdoc/foo.mcdoc',
				'file:///root/mcdoc/minecraft/bar.mcdoc',
			],
		},
		{
			uris: [
				'file:///root/mcdoc/foo.mcdoc',
				'file:///root/mcdoc/minecraft/bar.mcdoc',
			],
		},
		{
			uris: [
				'file:///root/mcdoc/mod.mcdoc',
				'file:///root/mcdoc/foo.mcdoc',
				'file:///root/mcdoc/minecraft/bar.mcdoc',
			],
		},
	]
	for (const { uris } of suites) {
		it(`Bind ${JSON.stringify(
			uris.map((u) =>
				u.startsWith('file:///root/') ? u.slice('file:///root/'.length) : u,
			),
		)}`, () => {
			const ctx = UriBinderContext.create(
				mockProjectData({ roots: ['file:///root/'] }),
			)
			uriBinder(uris, ctx)
			snapshot(SymbolFormatter.stringifySymbolTable(ctx.symbols.global))
		})
	}
})
