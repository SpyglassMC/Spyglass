import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { literal } from '../../lib/parser'

describe('mcfunction parser literal()', () => {
	const options = ['advancement', 'tell', 'tellraw']
	const cases: { content: string }[] = [
		{ content: '' },
		{ content: 'advancement grant @s everything' },
		{ content: 'tell @p Hello!' },
		{ content: 'tellraw @a "World!"' },
	]
	for (const { content } of cases) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = literal(options)
			snapshot(testParser(parser, content))
		})
	}
})
