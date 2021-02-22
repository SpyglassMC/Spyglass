import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { docComments } from '../../../lib'

describe('docComments()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'compound Something {}' },
		{ content: '/// This is a doc comment.' },
		{ content: '\t/// This is a doc comment.\n\t/// And more?\n\tfoo: Boolean' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = docComments()
			snapshot(testParser(parser, content))
		})
	}
})
