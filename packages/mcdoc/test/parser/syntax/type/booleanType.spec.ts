import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { booleanType } from '../../../../lib'

describe('mcdoc booleanType', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'boolean' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = booleanType
			snapshot(testParser(parser, content))
		})
	}
})
