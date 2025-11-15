import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { compound } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'node:test'

describe('nbt compound()', () => {
	const suites: { content: string }[] = [{ content: '' }, { content: '"string"' }, {
		content: '{}',
	}, { content: '{ foo: true }' }]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			const parser = compound
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
