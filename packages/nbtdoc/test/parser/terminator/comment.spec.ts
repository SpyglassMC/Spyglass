import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { comment } from '../../../lib'

describe('nbtdoc comment()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '/' },
		{ content: '//' },
		{ content: '// This is a comment.' },
		{ content: '/// This is a doc comment.' },
		{ content: '// This is a comment.\nnext line test;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = comment()
			snapshot(testParser(parser, content))
		})
	}
})
