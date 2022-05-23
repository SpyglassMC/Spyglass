import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.mjs'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { compound } from '@spyglassmc/nbt/lib/parser/index.mjs'

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
