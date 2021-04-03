import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { integer } from '../../lib'
import type { Options } from '../../lib/parser/integer'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('integer()', () => {
	const pattern = /^[+-]?(?:0|[1-9][0-9]*)$/

	describe('integer()', () => {
		const options: Options[] = [
			{ pattern },
		]
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
			describe('integer()', () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = integer(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})

	describe('integer(failsOnEmpty)', () => {
		describe('integer(failsOnEmpty=true)', () => {
			it('Parse ""', () => {
				const parser = integer({ pattern, failsOnEmpty: true })
				snapshot(testParser(parser, ''))
			})
		})
	})

	describe('integer(min, max, onOutOfRange)', () => {
		const options: Options[] = [
			{ pattern, min: BigInt(1) },
			{ pattern, max: BigInt(6) },
			{ pattern, min: BigInt(1), max: BigInt(6), onOutOfRange: (ans, _src, ctx) => ctx.err.report('Test message!', ans) },
		]
		const cases: { content: string }[] = [
			{ content: '0' },
			{ content: '3' },
			{ content: '9' },
		]
		for (const option of options) {
			describe(`integer(${option.min}, ${option.max}, ${option.onOutOfRange})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = integer(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})
})
