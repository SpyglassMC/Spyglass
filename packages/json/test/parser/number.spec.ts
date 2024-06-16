import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils.js'
import snapshot from 'snap-shot-it'
import { number } from '../../lib/parser/number.js'

describe('JSON number parser', () => {
	describe('number()', () => {
		const cases: { content: string }[] = [
			{ content: '1' },
			{ content: '1.2' },
			{ content: '1.0' },
			{ content: '0.0' },
			{ content: '0' },
			{ content: '-1' },
			{ content: '+1' },
			{ content: '1E12' },
			{ content: '1.0232E2' },
			{ content: '1.342E-10' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				snapshot(testParser(number, content))
			})
		}
	})
})
