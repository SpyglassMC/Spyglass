import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { ResourceLocationOptions } from '../../lib'
import { resourceLocation } from '../../lib'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('resourceLocation()', () => {
	const suites: { options: ResourceLocationOptions, content: string }[] = [
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
		{ options: { category: 'function' }, content: 'spg!:foo:qux/@#$%%ehh/42' },
		{ options: { category: 'function', allowTag: true }, content: '#tick' },
		{ options: { category: 'function', allowTag: false }, content: '#tick' },
	]
	for (const { content, options } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}" with ${options.category}, ${options.allowTag}`, () => {
			const parser = resourceLocation(options)
			snapshot(testParser(parser, content))
		})
	}
})
