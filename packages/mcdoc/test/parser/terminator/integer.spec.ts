import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { fallibleInteger, integer } from '../../../lib'

describe('mcdoc integer()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '-1' },
		{ content: '0' },
		{ content: '1' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = integer()
			snapshot(testParser(parser, content))
		})
	}
})
describe('mcdoc integer(unsigned = true)', () => {
	const suites: { content: string }[] = [
		{ content: '-1' },
		{ content: '0' },
		{ content: '1' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = integer(true)
			snapshot(testParser(parser, content))
		})
	}
})

describe('mcdoc fallibleInteger()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = fallibleInteger()
			snapshot(testParser(parser, content))
		})
	}
})
