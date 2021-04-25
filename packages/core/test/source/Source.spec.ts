import assert from 'assert'
import { describe, it } from 'mocha'
import { Range, Source } from '../../lib'
import { markOffsetInString, showWhitespaceGlyph } from '../utils'

describe('Source', () => {
	describe('nextCharRange()', () => {
		const suites: { string: string, cursor: number, expected: Range }[] = [
			{ string: 'foo', cursor: 0, expected: Range.create(0, 1) },
			{ string: 'foo', cursor: 1, expected: Range.create(1, 2) },
			{ string: 'foo', cursor: 2, expected: Range.create(2, 3) },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${Range.toString(expected)}' for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.nextCharRange
				assert.deepStrictEqual(actual, expected)
			})
		}
	})
	describe('clone()', () => {
		it('Should clone correctly', () => {
			const src = new Source('foobar')
			src.cursor = 3
			const actual = src.clone()
			assert.strictEqual(actual.cursor, 3)
			assert.strictEqual(actual.string, 'foobar')
		})
	})
	describe('canRead()', () => {
		const suites: { string: string, cursor: number, step?: number, expected: boolean }[] = [
			{ string: 'fo', cursor: 0, step: 1, expected: true },
			{ string: 'fo', cursor: 0, step: 2, expected: true },
			{ string: 'fo', cursor: 0, step: 3, expected: false },
			{ string: 'fo', cursor: 1, step: undefined, expected: true },
			{ string: 'fo', cursor: 1, step: 1, expected: true },
			{ string: 'fo', cursor: 1, step: 2, expected: false },
		]
		for (const { string, cursor, step, expected } of suites) {
			it(`Should return ${expected} for ${markOffsetInString(string, cursor)} with step ${step}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.canRead(step)
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('canReadInLine()', () => {
		const suites: { string: string, cursor: number, expected: boolean }[] = [
			{ string: 'fo\nbar', cursor: 0, expected: true },
			{ string: 'fo\nbar', cursor: 1, expected: true },
			{ string: 'fo\nbar', cursor: 2, expected: false },
			{ string: 'fo\nbar', cursor: 3, expected: true },
			{ string: 'fo\nbar', cursor: 4, expected: true },
			{ string: 'fo\nbar', cursor: 5, expected: true },
			{ string: 'fo\nbar', cursor: 6, expected: false },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return ${expected} for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.canReadInLine()
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('peek()', () => {
		const suites: { string: string, cursor: number, length?: number, offset?: number, expected: string }[] = [
			{ string: 'fo', cursor: 0, length: 1, offset: undefined, expected: 'f' },
			{ string: 'fo', cursor: 0, length: 1, offset: 0, expected: 'f' },
			{ string: 'fo', cursor: 0, length: 1, offset: 1, expected: 'o' },
			{ string: 'fo', cursor: 0, length: 1, offset: 2, expected: '' },
			{ string: 'fo', cursor: 1, length: 1, offset: 0, expected: 'o' },
			{ string: 'fo', cursor: 1, length: 1, offset: 1, expected: '' },
			{ string: 'fo', cursor: 0, length: undefined, offset: 0, expected: 'f' },
			{ string: 'fo', cursor: 0, length: 0, offset: 0, expected: '' },
			{ string: 'fo', cursor: 0, length: 2, offset: 0, expected: 'fo' },
			{ string: 'fo', cursor: 0, length: 3, offset: 0, expected: 'fo' },
		]
		for (const { string, cursor, length, offset, expected } of suites) {
			it(`Should return '${expected}' for ${markOffsetInString(string, cursor)} with offset ${offset}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.peek(length, offset)
				assert.strictEqual(actual, expected)
				assert.strictEqual(src.cursor, cursor)
			})
		}
	})
	describe('read()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'qux', cursor: 0, expected: 'q' },
			{ string: 'qux', cursor: 1, expected: 'u' },
			{ string: 'qux', cursor: 2, expected: 'x' },
			{ string: 'qux', cursor: 3, expected: '' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${expected}' at ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.read()
				assert.strictEqual(actual, expected)
				assert.strictEqual(src.cursor, cursor + 1)
			})
		}
	})
	describe('skip()', () => {
		const suites: { string: string, cursor: number, step?: number, expectedCursor: number }[] = [
			{ string: 'qux', cursor: 0, step: 0, expectedCursor: 0 },
			{ string: 'qux', cursor: 0, step: undefined, expectedCursor: 1 },
			{ string: 'qux', cursor: 0, step: 1, expectedCursor: 1 },
			{ string: 'qux', cursor: 0, step: 2, expectedCursor: 2 },
			{ string: 'qux', cursor: 1, step: 2, expectedCursor: 3 },
		]
		for (const { string, cursor, step, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)} with step ${step}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skip(step)
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('slice()', () => {
		it('Should return correctly', () => {
			const src = new Source('foo bar baz qux')
			assert.strictEqual(src.slice(Range.create(0, 1)), 'f')
			assert.strictEqual(src.slice(Range.create(5, 8)), 'ar ')
		})
	})
	describe('readLine()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'qux', cursor: 0, expected: 'qux' },
			{ string: 'qux\nfoobar', cursor: 0, expected: 'qux' },
			{ string: 'qux\rfoobar', cursor: 0, expected: 'qux' },
			{ string: 'qux\r\nfoobar', cursor: 0, expected: 'qux' },
			{ string: 'qux\nfoobar', cursor: 3, expected: '' },
			{ string: 'qux\nfoobar', cursor: 4, expected: 'foobar' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${expected}' for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.readLine()
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('skipLine()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'qux', cursor: 0, expectedCursor: 3 },
			{ string: 'qux\nfoobar', cursor: 0, expectedCursor: 3 },
			{ string: 'qux\rfoobar', cursor: 0, expectedCursor: 3 },
			{ string: 'qux\r\nfoobar', cursor: 0, expectedCursor: 3 },
			{ string: 'qux\nfoobar', cursor: 3, expectedCursor: 3 },
			{ string: 'qux\nfoobar', cursor: 4, expectedCursor: 10 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skipLine()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('nextLine()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'qux', cursor: 0, expectedCursor: 3 },
			{ string: 'qux\nfoobar', cursor: 0, expectedCursor: 4 },
			{ string: 'qux\rfoobar', cursor: 0, expectedCursor: 4 },
			{ string: 'qux\r\nfoobar', cursor: 0, expectedCursor: 5 },
			{ string: 'qux\n\rfoobar', cursor: 0, expectedCursor: 4 },
			{ string: 'qux\nfoobar', cursor: 3, expectedCursor: 4 },
			{ string: 'qux\nfoobar', cursor: 4, expectedCursor: 10 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.nextLine()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('readSpace()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'foo', cursor: 0, expected: '' },
			{ string: ' \tF', cursor: 0, expected: ' \t' },
			{ string: ' \t', cursor: 0, expected: ' \t' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${showWhitespaceGlyph(expected)}' for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.readSpace()
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('skipSpace()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'foo', cursor: 0, expectedCursor: 0 },
			{ string: ' \tF', cursor: 0, expectedCursor: 2 },
			{ string: ' \t', cursor: 0, expectedCursor: 2 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skipSpace()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('readWhitespace()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'foo', cursor: 0, expected: '' },
			{ string: ' \t\r\nF', cursor: 0, expected: ' \t\r\n' },
			{ string: ' \t\r\n', cursor: 0, expected: ' \t\r\n' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return ${showWhitespaceGlyph(expected)} for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.readWhitespace()
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('skipWhitespace()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'foo', cursor: 0, expectedCursor: 0 },
			{ string: ' \t\r\nF', cursor: 0, expectedCursor: 4 },
			{ string: ' \t\r\n', cursor: 0, expectedCursor: 4 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skipWhitespace()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('readUntilOrEnd()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'foo', cursor: 0, expected: 'foo' },
			{ string: 'foo$bar', cursor: 0, expected: 'foo' },
			{ string: 'foo$bar', cursor: 1, expected: 'oo' },
			{ string: 'foo$bar', cursor: 3, expected: '' },
			{ string: 'foo$bar', cursor: 4, expected: 'bar' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${expected}' for ${markOffsetInString(string, cursor)} when reading until '$'`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.readUntilOrEnd('$')
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('readUntilLineEnd()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'foo', cursor: 0, expected: 'foo' },
			{ string: ' \t\r\n', cursor: 0, expected: ' \t' },
			{ string: 'foo\nbar', cursor: 4, expected: 'bar' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return ${showWhitespaceGlyph(expected)} for ${markOffsetInString(string, cursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.readUntilLineEnd()
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('skipUntilLineEnd()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'foo', cursor: 0, expectedCursor: 3 },
			{ string: ' \t\r\n', cursor: 0, expectedCursor: 2 },
			{ string: 'foo\nbar', cursor: 4, expectedCursor: 7 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skipUntilLineEnd()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('skipRemaining()', () => {
		const suites: { string: string, cursor: number, expectedCursor: number }[] = [
			{ string: 'foo', cursor: 0, expectedCursor: 3 },
			{ string: 'foo bar baz qux', cursor: 2, expectedCursor: 15 },
		]
		for (const { string, cursor, expectedCursor } of suites) {
			it(`Should skip from ${markOffsetInString(string, cursor)} to ${markOffsetInString(string, expectedCursor)}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actualSelf = src.skipRemaining()
				assert.strictEqual(actualSelf, src)
				assert.strictEqual(actualSelf.cursor, expectedCursor)
			})
		}
	})
	describe('static', () => {
		describe('isBrigadierQuote()', () => {
			const suites: { c: string, expected: boolean }[] = [
				{ c: ' ', expected: false },
				{ c: '"', expected: true },
				{ c: "'", expected: true },
			]
			for (const { c, expected } of suites) {
				it(`Should return ${expected} for '${showWhitespaceGlyph(c)}'`, () => {
					const actual = Source.isBrigadierQuote(c)
					assert.strictEqual(actual, expected)
				})
			}
		})
		describe('isNewline()', () => {
			const suites: { c: string, expected: boolean }[] = [
				{ c: ' ', expected: false },
				{ c: '\t', expected: false },
				{ c: '\r\n', expected: true },
				{ c: '\r', expected: true },
				{ c: '\n', expected: true },
				{ c: 'A', expected: false },
			]
			for (const { c, expected } of suites) {
				it(`Should return ${expected} for '${showWhitespaceGlyph(c)}'`, () => {
					const actual = Source.isNewline(c)
					assert.strictEqual(actual, expected)
				})
			}
		})
		describe('isSpace()', () => {
			const suites: { c: string, expected: boolean }[] = [
				{ c: ' ', expected: true },
				{ c: '\t', expected: true },
				{ c: '\r\n', expected: false },
				{ c: '\r', expected: false },
				{ c: '\n', expected: false },
				{ c: 'A', expected: false },
			]
			for (const { c, expected } of suites) {
				it(`Should return ${expected} for '${showWhitespaceGlyph(c)}'`, () => {
					const actual = Source.isSpace(c)
					assert.strictEqual(actual, expected)
				})
			}
		})
		describe('isWhitespace()', () => {
			const suites: { c: string, expected: boolean }[] = [
				{ c: ' ', expected: true },
				{ c: '\t', expected: true },
				{ c: '\r\n', expected: true },
				{ c: '\r', expected: true },
				{ c: '\n', expected: true },
				{ c: 'A', expected: false },
			]
			for (const { c, expected } of suites) {
				it(`Should return ${expected} for '${showWhitespaceGlyph(c)}'`, () => {
					const actual = Source.isWhitespace(c)
					assert.strictEqual(actual, expected)
				})
			}
		})
	})
})
