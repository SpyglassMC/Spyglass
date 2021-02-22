import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { minecraftIdentifier } from '../../../lib'

describe('minecraftIdentifier()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: 'foo:' },
		{ content: 'foo:bar' },
		{ content: 'foo:bar/baz' },
		{ content: 'foo:bar:baz' },
		{ content: ':/' }, // :/
		{ content: 'foo:bar\nsomething else;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = minecraftIdentifier()
			snapshot(testParser(parser, content))
		})
	}
})
