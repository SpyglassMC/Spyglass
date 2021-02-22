import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { keyword, punctuation } from '../../../lib'

describe('keyword()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'f' },
		{ content: 'foo' },
		{ content: 'foobar' },
		{ content: 'foo something else;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = keyword('foo')
			snapshot(testParser(parser, content))
		})
	}
})

describe('punctuation()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: ';' },
		{ content: ';foo' },
		{ content: ';\nsomething else;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = punctuation(';')
			snapshot(testParser(parser, content))
		})
	}
})
