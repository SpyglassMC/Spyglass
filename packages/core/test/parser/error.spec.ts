import { describe, it } from 'node:test'

import { error } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('error()', () => {
	const suites: { content: string }[] = [{ content: '' }, { content: '\t' }, {
		content: 'whatever\nall errors',
	}]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
			t.assert.snapshot(testParser(error, content))
		})
	}
})
