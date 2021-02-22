import { showWhiteSpaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { error } from '../../../lib'

describe('error()', () => {
	describe('parse()', () => {
		const suites: { content: string }[] = [
			{ content: '' },
			{ content: 'Something\nNext line;' },
		]
		for (const { content } of suites) {
			it(`Should parse '${showWhiteSpaceGlyph(content)}'`, () => {
				const parser = error()
				snapshot(testParser(parser, content))
			})
		}
	})
})
