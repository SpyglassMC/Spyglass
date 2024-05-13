import {
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import snapshot from 'snap-shot-it'
import { array } from '../../lib/parser/array.js'

describe('JSON array parser', () => {
	describe('array()', () => {
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: '[]' },
			{ content: '[1]' },
			{ content: '[1,2]' },
			{ content: '[1,2,]' },
			{ content: '[[1],2]' },
			{ content: '["hey","there"]' },
			{ content: '["\\"","\\u1234"]' },
			{ content: '["\\u1z34"]' },
			{ content: '["\\z"]' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				snapshot(testParser(array, content))
			})
		}
	})
})
