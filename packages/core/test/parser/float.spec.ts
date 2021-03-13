import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { ErrorSeverity, float } from '../../lib'
import type { Options } from '../../lib/parser/float'
import { showWhitespaceGlyph, testParser } from '../utils'

describe('float()', () => {
	describe('float(leadingZeros, minusSign, plusSign, emptyBeforeDecimalSeparator, emptyAfterDecimalSeparator, exponent)', () => {
		const options: Options[] = [
			{ leadingZeros: true, minusSign: true, plusSign: true, emptyBeforeDecimalSeparator: true, emptyAfterDecimalSeparator: true, exponent: { leadingZeros: true, minusSign: true, plusSign: true } },
			{ leadingZeros: false, minusSign: false, plusSign: false, emptyBeforeDecimalSeparator: false, emptyAfterDecimalSeparator: false },
		]
		const cases: { content: string }[] = [
			{ content: '' },
			{ content: 'foo' },
			{ content: '.E' },
			{ content: '123' },
			{ content: '1.0045' },
			{ content: '7e+3' },
		]
		for (const option of options) {
			describe(`float(${option.leadingZeros}, ${option.minusSign}, ${option.plusSign}, ${option.emptyBeforeDecimalSeparator}, ${option.emptyAfterDecimalSeparator}, ${JSON.stringify(option.exponent)})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = float(option)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})

	describe('float(min, max, outOfRangeSeverity)', () => {
		const options: Options[] = [
			{ leadingZeros: false, minusSign: false, plusSign: false, emptyBeforeDecimalSeparator: false, emptyAfterDecimalSeparator: false, min: 1 },
			{ leadingZeros: false, minusSign: false, plusSign: false, emptyBeforeDecimalSeparator: false, emptyAfterDecimalSeparator: false,  max: 6 },
			{ leadingZeros: false, minusSign: false, plusSign: false, emptyBeforeDecimalSeparator: false, emptyAfterDecimalSeparator: false, min: 1, max: 6, outOfRangeSeverity: ErrorSeverity.Warning },
		]
		const cases: { content: string }[] = [
			{ content: '0.0' },
			{ content: '3.0' },
			{ content: '9.0' },
		]
		for (const option of options) {
			describe(`float(${option.min}, ${option.max}, ${option.outOfRangeSeverity})`, () => {
				for (const { content } of cases) {
					it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
						const parser = float(option as any)
						snapshot(testParser(parser, content))
					})
				}
			})
		}
	})
})
