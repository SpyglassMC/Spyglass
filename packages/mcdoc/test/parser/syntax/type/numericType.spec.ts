import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { numericType } from '../../../../lib'

describe('mcdoc numericType', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'byte' },
		{ content: 'int @ 4' },
		{ content: 'double@4.2..5.5' },
		{ content: 'double[]' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = numericType
			snapshot(testParser(parser, content))
		})
	}
})
