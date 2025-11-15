import { describe, it } from 'node:test'

import type { ResourceLocationOptions } from '../../lib/index.js'
import { resourceLocation } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('resourceLocation()', () => {
	const suites: { options: ResourceLocationOptions; content: string }[] = [
		{ options: { category: 'function' }, content: '' },
		{ options: { category: 'function' }, content: 'foo' },
		{ options: { category: 'function' }, content: 'foo/bar' },
		{ options: { category: 'function' }, content: ':' },
		{ options: { category: 'function' }, content: ':/' },
		{ options: { category: 'function' }, content: ':foo' },
		{ options: { category: 'function' }, content: ':foo/bar' },
		{ options: { category: 'function' }, content: 'minecraft:foo/bar' },
		{ options: { category: 'function' }, content: 'spgoding:foo/bar' },
		{ options: { category: 'function' }, content: 'foo # can you stop before here?' },
		{ options: { category: 'function' }, content: 'spg/:foo:qux/H/42' },
		{ options: { category: 'function', allowTag: true }, content: '#tick' },
		{ options: { category: 'function', allowTag: false }, content: '#tick' },
	]
	for (const { content, options } of suites) {
		it(
			`Parse "${showWhitespaceGlyph(content)}" with ${options.category}, ${options.allowTag}`,
			(t) => {
				const parser = resourceLocation(options)
				t.assert.snapshot(testParser(parser, content))
			},
		)
	}
})
