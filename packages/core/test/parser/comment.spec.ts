import { describe, it } from 'node:test'

import { comment } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('comment()', () => {
	const suites: { prefixes: Set<string>; content: string }[] = [
		{ prefixes: new Set(['//']), content: '' },
		{ prefixes: new Set(['//']), content: '// This is a comment.' },
		{ prefixes: new Set(['//']), content: '// This is a comment.\nAnother line here.' },
		{ prefixes: new Set(['//']), content: '# Whoops.\n// The world is burning!' },
	]
	for (const { prefixes, content } of suites) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = comment({ singleLinePrefixes: prefixes })
			t.assert.snapshot(testParser(parser, content))
		})
		it(`Parse '${showWhitespaceGlyph(content)}' with 'includesEol' on`, (t) => {
			const parser = comment({ singleLinePrefixes: prefixes, includesEol: true })
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
