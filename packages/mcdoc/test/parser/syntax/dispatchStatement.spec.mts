// import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
// import { describe, it } from 'mocha'
// import snapshot from 'snap-shot-it'
// import { dispatchStatement } from '../../../lib/index.mjs'

// describe('dispatchStatement()', () => {
// 	const suites: { content: string }[] = [
// 		{ content: '' },
// 		{ content: 'Foo describes [];' },
// 		{ content: 'Foo describes minecraft:item' },
// 		{ content: 'Foo describes minecraft:item;' },
// 		{ content: 'Foo describes minecraft:item; something else;' },
// 		{ content: 'Foo describes minecraft:item[];' },
// 		{ content: 'Foo describes minecraft:item[minecraft:stone];' },
// 		{ content: 'Foo describes minecraft:item[\n\tminecraft:stone,\n\tminecraft:grass_block\n];' },
// 		{ content: 'Foo describes minecraft:item[\n\tminecraft:stone,\n\tminecraft:grass_block,\n];' },
// 	]
// 	for (const { content } of suites) {
// 		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
// 			const parser = dispatchStatement()
// 			snapshot(testParser(parser, content))
// 		})
// 	}
// })
