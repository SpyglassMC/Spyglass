// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { docComment } from '../../../lib'

// describe('docComment', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: '/' },
// 		{ content: '// This is a comment.' },
// 		{ content: '/// This is a doc comment.' },
// 		{ content: '/// This is a doc comment.\nnext line test;' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = docComment
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
