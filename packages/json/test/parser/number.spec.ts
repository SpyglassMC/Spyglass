import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test/utils.ts'
import { describe, it } from 'node:test'
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
			{ content: '1_000' },
			{ content: '1_000.5' },
			{ content: '1.5_5' },
			{ content: '1E1_0' },
		]
		for (const { content } of cases) {
			it(`Parse '${showWhitespaceGlyph(content)}'`, (t) => {
				t.assert.snapshot(testParser(number, content))
			})
		}
	})
})
