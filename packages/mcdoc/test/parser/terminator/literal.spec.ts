// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { keyword, literal, marker, punctuation } from '../../../lib'

// describe('mcdoc keyword()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: 'foo' },
// 		{ content: 'foobar' },
// 		{ content: 'foo something else;' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = keyword('foo')
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })

// describe('mcdoc literal()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: 'foo' },
// 		{ content: 'foobar' },
// 		{ content: 'foo something else;' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = literal('foo')
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })

// describe('mcdoc marker()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: ';' },
// 		{ content: ';foo' },
// 		{ content: ';\nsomething else;' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = marker(';')
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })

// describe('mcdoc punctuation()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: ';' },
// 		{ content: ';foo' },
// 		{ content: ';\nsomething else;' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = punctuation(';')
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
