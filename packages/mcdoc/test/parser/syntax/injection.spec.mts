// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { injectClause } from '../../../lib/index.mjs'

// describe('injectClause()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: 'inject' },
// 		{ content: 'inject compound' },
// 		{ content: 'inject enum' },
// 		{ content: 'inject compound super::Foo {}' },
// 		{ content: 'inject compound super::Foo {\n\t/// Doc comment.\n\tbar: string\n}' },
// 		{ content: 'inject compound super::Foo {\n\t/// Doc comment 1.\n\tbar: string\n,\n\t/// Doc comment 2.\n\tbar: string\n}' },
// 		{ content: 'inject enum () super::Eww {}' },
// 		{ content: 'inject enum (string) super::Eww {\n\t/// Doc comment.\n\tColor = "Red"\n}' },
// 		{ content: 'inject enum (string) super::Eww {\n\t/// Doc comment 1.\n\tColor1 = "Red",\n\t/// Doc comment 2.\n\tColor2 = "Blue"\n}' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = injectClause()
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
