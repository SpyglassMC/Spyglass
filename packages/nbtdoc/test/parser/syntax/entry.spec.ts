import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { entry } from '../../../lib'

describe('entry()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'mod describes;' },
		{ content: 'mod describes minecraft:block;' },
	]
	for (const { content } of suites) {
		it(`Test "${showWhitespaceGlyph(content)}"`, () => {
			const parser = entry()
			snapshot(testParser(parser, content))
		})
	}
})
