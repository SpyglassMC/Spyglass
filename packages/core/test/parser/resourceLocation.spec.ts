import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { resourceLocation } from '../../lib'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('resourceLocation()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: 'foo/bar' },
		{ content: ':' },
		{ content: ':/' },
		{ content: ':foo' },
		{ content: ':foo/bar' },
		{ content: 'minecraft:foo/bar' },
		{ content: 'spgoding:foo/bar' },
		{ content: 'foo # can you stop before here?' },
		{ content: 'spg!:foo:qux/@#$%%ehh/42' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = resourceLocation
			snapshot(testParser(parser, content))
		})
	}
})
