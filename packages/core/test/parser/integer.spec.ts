import { describe, it } from 'node:test'

import { integer } from '../../lib/index.js'
import type { Options } from '../../lib/parser/integer.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('integer()', () => {
	const pattern = /^[+-]?(?:0|[1-9][0-9]*)$/

	describe('integer()', () => {
		const option: Options = { pattern }
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: 'foo' },
			{ content: '+' },
			{ content: '+1' },
			{ content: '-1' },
			{ content: '123' },
			{ content: '-123' },
			{ content: '0123' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
				const parser = integer(option)
				t.assert.snapshot(testParser(parser, content))
			})
		}
	})

	describe('integer(failsOnEmpty)', () => {
		describe('integer(failsOnEmpty=true)', () => {
			it('Parse ""', (t) => {
				const parser = integer({ pattern, failsOnEmpty: true })
				t.assert.snapshot(testParser(parser, ''))
			})
		})
	})

	describe('integer(min, max, onOutOfRange)', () => {
		const options: Options[] = [{ pattern, min: 1 }, { pattern, max: 6 }, {
			pattern,
			min: 1,
			max: 6,
			onOutOfRange: (ans, _src, ctx) => ctx.err.report('Test message!', ans),
		}]
		const cases: { content: string }[] = [{ content: '0' }, { content: '3' }, { content: '9' }]
		for (const option of options) {
			describe(`integer(${option.min}, ${option.max}, ${!!option.onOutOfRange})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
						const parser = integer(option as any)
						t.assert.snapshot(testParser(parser, content))
					})
				}
			})
		}
	})
})
