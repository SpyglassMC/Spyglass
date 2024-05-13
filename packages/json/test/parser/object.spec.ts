import {
	showWhitespaceGlyph,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import snapshot from 'snap-shot-it'
import { object } from '../../lib/parser/object.js'

describe('JSON object parser', () => {
	describe('object()', () => {
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: '{}' },
			{ content: '{1: 2}' },
			{ content: '{"1": "2"}' },
			{ content: '{"1": "2", "3": "4"}' },
			{ content: '{"1": {"2": "3"}, {"4": "5"}}' },
			{ content: '{"hey": "there"}' },
			{ content: '{"\\"": "\\u1234"}' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				snapshot(testParser(object, content))
			})
		}
	})
})
