import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { resLoc } from '../../../lib'

describe('mcdoc resLoc()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: 'foo:' },
		{ content: 'foo:bar' },
		{ content: 'foo:bar/baz' },
		{ content: 'foo:bar:baz' },
		{ content: ':/' },
		{ content: 'foo:bar\nsomething else;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = resLoc({ pool: [], allowUnknown: true })
			snapshot(testParser(parser, content))
		})
	}
})
