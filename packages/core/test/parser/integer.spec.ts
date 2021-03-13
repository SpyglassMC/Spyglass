import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ErrorSeverity, integer } from '../../lib'
import type { Options } from '../../lib/parser/integer'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('integer()', () => {
	describe('integer(leadingZeros, minusSign, plusSign)', () => {
		const options: Options[] = [
			{ leadingZeros: true, minusSign: true, plusSign: true },
			{ leadingZeros: false, minusSign: false, plusSign: false },
		]
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: 'foo' },
			{ content: '-' },
			{ content: '-0' },
			{ content: '0' },
			{ content: '+0' },
			{ content: '-1' },
			{ content: '1' },
			{ content: '+1' },
			{ content: '123' },
			{ content: '0123' },
		]
		for (const option of options) {
			describe(`integer(${option.leadingZeros}, ${option.minusSign}, ${option.plusSign})`, () => {
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
				const parser = integer({ leadingZeros: false, minusSign: false, plusSign: false, failsOnEmpty: true })
				snapshot(testParser(parser, ''))
			})
		})
	})

	describe('integer(allowsEmpty)', () => {
		describe('integer(allowsEmpty=true)', () => {
			const cases: { content: string }[] = [
				{ content: '' },
				{ content: '-' },
			]
			for (const { content } of cases) {
				it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
					const parser = integer({ leadingZeros: true, minusSign: true, plusSign: true, allowsEmpty: true })
					snapshot(testParser(parser, content))
				})
			}
		})
	})

	describe('integer(min, max, outOfRangeSeverity)', () => {
		const options: Options[] = [
			{ leadingZeros: false, minusSign: false, plusSign: false, min: BigInt(1) },
			{ leadingZeros: false, minusSign: true, plusSign: false, max: BigInt(6) },
			{ leadingZeros: false, minusSign: false, plusSign: true, min: BigInt(1), max: BigInt(6), outOfRangeSeverity: ErrorSeverity.Warning },
		]
		const cases: { content: string }[] = [
			{ content: '0' },
			{ content: '3' },
			{ content: '9' },
		]
		for (const option of options) {
			describe(`integer(${option.min}, ${option.max}, ${option.outOfRangeSeverity})`, () => {
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
