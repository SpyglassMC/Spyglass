import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { boolean } from '../../lib/index.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

describe('boolean()', () => {
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'true' },
		{ content: 'false' },
		{ content: 'foo' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = boolean
			snapshot(testParser(parser, content))
		})
	}
})
