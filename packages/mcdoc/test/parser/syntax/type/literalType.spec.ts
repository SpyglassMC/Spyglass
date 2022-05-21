import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { literalType } from '../../../../lib'

describe('mcdoc literalType', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'false' },
		{ content: 'true' },
		{ content: '"a literal string"' },
		{ content: '1b' },
		{ content: '1.23e4' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = literalType
			snapshot(testParser(parser, content))
		})
	}
})
