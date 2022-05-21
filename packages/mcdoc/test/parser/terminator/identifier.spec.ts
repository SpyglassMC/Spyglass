import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { identifier } from '../../../lib'

describe('mcdoc identifier', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: '123' },
		{ content: 'foo123' },
		{ content: 'foo()bar' },
		{ content: 'foo;bar' },
		{ content: 'foo\nbar' },
		{ content: 'foo你好;bar' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = identifier
			snapshot(testParser(parser, content))
		})
	}
})
