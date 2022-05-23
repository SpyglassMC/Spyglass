// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { enumDefinition } from '../../../lib/index.js'

// describe('enumDefinition()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: 'enum' },
// 		{
// 			content: 'enum(byte) TestEnum {One = 1,}',
// 		},
// 		{
// 			content: `/// Doc comments for enum
// enum(string) TestEnum {
// 	/// Doc comments for field 1
// 	/// The second line
// 	Foo = "foo"
// }`,
// 		},
// 		{
// 			content: `/// Doc comments for enum
// enum(float) TestEnum {
// 	/// Doc comments for field 1
// 	One = 1.0,
// 	/// Doc comments for field 2
// 	Two = 2.0
// }`,
// 		},
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = enumDefinition()
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
