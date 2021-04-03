import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { float } from '../../lib'
import type { Options } from '../../lib/parser/float'
import { showWhitespaceGlyph, testParser } from '../utils'

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
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				const parser = float(option as any)
				snapshot(testParser(parser, content))
			})
		}
	})

	describe('float(min, max, onOutOfRange)', () => {
		const options: Options[] = [
			{ pattern, min: 1 },
			{ pattern, max: 6 },
			{ pattern, min: 1, max: 6, onOutOfRange: (ans, _src, ctx) => ctx.err.report('Testing MESSAGE', ans) },
		]
		const cases: { content: string }[] = [
			{ content: '0.0' },
			{ content: '3.0' },
			{ content: '9.0' },
		]
		for (const option of options) {
			describe(`float(${option.min}, ${option.max}, ${!!option.onOutOfRange})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = float(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})

	describe('float(failsOnEmpty = true)', () => {
		const option: Options = { pattern, failsOnEmpty: true }
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: '7e+3' },
		]
		for (const { content } of cases) {
			it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
				const parser = float(option as any)
				snapshot(testParser(parser, content))
			})
		}
	})
})
