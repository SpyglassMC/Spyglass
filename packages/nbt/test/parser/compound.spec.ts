import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { compound } from '../../lib/parser'

describe('nbt compound()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: '"string"' },
		{ content: '{}' },
		{ content: '{ foo: true }' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = compound
			snapshot(testParser(parser, content))
		})
	}
})
