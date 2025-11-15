import { describe, it } from 'node:test'

import { float } from '../../lib/index.js'
import type { Options } from '../../lib/parser/float.js'
import { showWhitespaceGlyph, testParser } from '../utils.ts'

describe('float()', () => {
	const pattern = /[-+]?(?:[0-9]+\.|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?/i
	describe('float()', () => {
		const option: Options = { pattern }
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: 'foo' },
			{ content: '.E' },
			{ content: '123' },
			{ content: '1.0045' },
			{ content: '7e+3' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
				const parser = float(option as any)
				t.assert.snapshot(testParser(parser, content))
			})
		}
	})

	describe('float(min, max, onOutOfRange)', () => {
		const options: Options[] = [{ pattern, min: 1 }, { pattern, max: 6 }, {
			pattern,
			min: 1,
			max: 6,
			onOutOfRange: (ans, _src, ctx) => ctx.err.report('Testing MESSAGE', ans),
		}]
		const cases: { content: string }[] = [{ content: '0.0' }, { content: '3.0' }, {
			content: '9.0',
		}]
		for (const option of options) {
			describe(`float(${option.min}, ${option.max}, ${!!option.onOutOfRange})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
						const parser = float(option as any)
						t.assert.snapshot(testParser(parser, content))
					})
				}
			})
		}
	})

	describe('float(failsOnEmpty = true)', () => {
		const option: Options = { pattern, failsOnEmpty: true }
		const cases: { content: string }[] = [{ content: '' }, { content: '7e+3' }]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, (t) => {
				const parser = float(option as any)
				t.assert.snapshot(testParser(parser, content))
			})
		}
	})
})
