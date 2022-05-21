// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { fallibleFloat, float } from '../../../lib'

// describe('mcdoc float', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: '-1.4' },
// 		{ content: '0' },
// 		{ content: '.7e+3' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = float
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })

// describe('mcdoc fallibleFloat', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: '.7e+3' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = fallibleFloat
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
