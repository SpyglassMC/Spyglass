import { describe, it } from 'node:test'

import { boolean } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('boolean()', () => {
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'true' },
		{ content: 'false' },
		{ content: 'foo' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			const parser = boolean
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
