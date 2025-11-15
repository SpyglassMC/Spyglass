import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { path } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'node:test'

describe('nbt path()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '文字' },
		{ content: 'foo' },
		{ content: '"foo"' },
		{ content: "'foo'" },
		{ content: '{ }' },
		{ content: '[ ]' },
		{ content: 'foo{ }' },
		{ content: 'foo[ ]' },
		{ content: 'foo[ ].bar' },
		{ content: 'foo[ ][ ]' },
		{ content: 'foo[ ].[ ]' },
		{ content: 'foo[ 0 ]' },
		{ content: 'foo[ { } ]' },
		{ content: 'foo.[ ]' },
		{ content: 'foo.bar' },
		{ content: 'foo.{ }' },
		{ content: '{ }.foo' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			const parser = path
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
