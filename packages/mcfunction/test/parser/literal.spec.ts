import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
import { literal } from '../../lib/parser/index.js'

describe('mcfunction parser literal()', () => {
	const options = ['advancement', 'tell', 'tellraw']
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'advancement grant @s everything' },
		{ content: 'tell @p Hello!' },
		{ content: 'tellraw @a "World!"' },
	]
	for (const { content } of cases) {
		it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
			const parser = literal(options)
			t.assert.snapshot(testParser(parser, content))
		})
	}
})
