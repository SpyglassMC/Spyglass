import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { anyType } from '../../../../lib'

describe('mcdoc anyType', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'any' },
		{ content: '#[id] any' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = anyType
			snapshot(testParser(parser, content))
		})
	}
})
