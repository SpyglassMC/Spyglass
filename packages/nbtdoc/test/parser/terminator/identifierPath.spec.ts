import { showWhiteSpaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { identifierPath } from '../../../lib'

describe('identifierPath()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: 'foo::bar' },
		{ content: '::foo::bar' },
		{ content: 'super::foo' },
		{ content: 'super::foo::bar' },
		{ content: 'super::foo something else;' },
	]
	for (const { content } of suites) {
		it(`Should parse '${showWhiteSpaceGlyph(content)}'`, () => {
			const parser = identifierPath()
			snapshot(testParser(parser, content))
		})
	}
})
