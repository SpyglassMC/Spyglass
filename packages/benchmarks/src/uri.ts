import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import * as je from '@spyglassmc/java-edition'
import node from 'node:url'
import type { BenchContext } from './index.js'

export async function register(bench: BenchContext) {
	const fileUri = 'file:///project/data/minecraft/recipes/foo/bar/baz/qux.json'
	const rootUri = 'file:///project/'
	const ctx = core.UriBinderContext.create(
		mockProjectData({ roots: [rootUri], ctx: { loadedVersion: '1.15' } }),
	)

	bench.add('uri dissectUri', () => {
		je.binder.dissectUri(fileUri, ctx)
	})

	bench.add('uri getRelativeUriFromBase', () => {
		core.fileUtil.getRelativeUriFromBase(fileUri, rootUri)
	})

	bench.add('uri whatwg-url x2', () => {
		new core.Uri(fileUri)
		new core.Uri(rootUri)
	})

	bench.add('uri node:url x2', () => {
		new node.URL(fileUri)
		new node.URL(rootUri)
	})
}
