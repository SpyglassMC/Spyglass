import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { stringType } from '../../../../lib'

describe('mcdoc stringType', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'other' },
		{ content: 'string' },
		{ content: 'string @' },
		{ content: 'string@42..' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = stringType
			snapshot(testParser(parser, content))
		})
	}
})
