import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { long } from '../../lib/index.js'
import type { Options } from '../../lib/parser/long.js'
import { showWhitespaceGlyph, testParser } from '../utils.js'

describe('long()', () => {
	const pattern = /^[+-]?(?:0|[1-9][0-9]*)$/

	describe('long()', () => {
		const options: Options[] = [{ pattern }]
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
		for (const option of options) {
			describe('long()', () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = long(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})

	describe('long(failsOnEmpty)', () => {
		describe('long(failsOnEmpty=true)', () => {
			it('Parse ""', () => {
				const parser = long({ pattern, failsOnEmpty: true })
				snapshot(testParser(parser, ''))
			})
		})
	})

	describe('long(min, max, onOutOfRange)', () => {
		const options: Options[] = [{ pattern, min: 1n }, { pattern, max: 6n }, {
			pattern,
			min: 1n,
			max: 6n,
			onOutOfRange: (ans, _src, ctx) => ctx.err.report('Test message!', ans),
		}]
		const cases: { content: string }[] = [{ content: '0' }, { content: '3' }, { content: '9' }]
		for (const option of options) {
			describe(`long(${option.min}, ${option.max}, ${!!option.onOutOfRange})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = long(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})
})
