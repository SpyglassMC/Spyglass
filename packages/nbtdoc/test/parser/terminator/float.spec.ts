import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { float } from '../../../lib'

describe('float()', () => {
	const suites: { content: string }[] = [
		{ content: '-1.4' },
		{ content: '0' },
		{ content: '.7e+3' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = float()
			snapshot(testParser(parser, content))
		})
	}
})
