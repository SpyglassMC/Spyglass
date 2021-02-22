import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { comment } from '../../lib'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('comment()', () => {
	const suites: { prefixes: Set<string>, content: string }[] = [
		{ prefixes: new Set(['//']), content: '' },
		{ prefixes: new Set(['//']), content: '// This is a comment.' },
		{ prefixes: new Set(['//']), content: '// This is a comment.\nAnother line here.' },
		{ prefixes: new Set(['//']), content: '# Whoops.\n// The world is burning!' },
	]
	for (const { prefixes, content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = comment({ singleLinePrefixes: prefixes })
			snapshot(testParser(parser, content))
		})
	}
})
