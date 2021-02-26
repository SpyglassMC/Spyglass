import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { float } from '../../../lib'

describe('float()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: '0' },
		{ content: '+1' },
		{ content: '1' },
		{ content: '-1' },
		{ content: '123' },
		{ content: '0123' },
		{ content: '1.23' },
		{ content: '.23' },
		{ content: '1.' },
		{ content: '1.23e' },
		{ content: '1.23e1' },
		{ content: '1.23E-3' },
		{ content: '1.23E+3' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = float()
			snapshot(testParser(parser, content))
		})
	}
})
