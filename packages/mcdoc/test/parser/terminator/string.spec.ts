import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { string } from '../../../lib'

describe('string()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: '"foo' },
		{ content: '"foo"' },
		{ content: '"fo\no"' },
		{ content: '"fo\\no"' },
		{ content: '"fo\\Ao"' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			snapshot(testParser(string, content))
		})
	}
})
