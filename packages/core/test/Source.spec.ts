import assert from 'assert'
import { describe, it } from 'mocha'
import { Source } from '../lib/Source'
import { markOffsetInString, showWhiteSpaceGlyph } from './utils'

describe('Source', () => {
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
	describe('peek()', () => {
		const suites: { string: string, cursor: number, offset?: number, expected: string }[] = [
			{ string: 'fo', cursor: 0, offset: undefined, expected: 'f' },
			{ string: 'fo', cursor: 0, offset: 0, expected: 'f' },
			{ string: 'fo', cursor: 0, offset: 1, expected: 'o' },
			{ string: 'fo', cursor: 0, offset: 2, expected: '' },
			{ string: 'fo', cursor: 1, offset: 0, expected: 'o' },
			{ string: 'fo', cursor: 1, offset: 1, expected: '' },
		]
		for (const { string, cursor, offset, expected } of suites) {
			it(`Should return '${expected}' for ${markOffsetInString(string, cursor)} with offset ${offset}`, () => {
				const src = new Source(string)
				src.cursor = cursor
				const actual = src.peek(offset)
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
	describe('readSpace()', () => {
		const suites: { string: string, cursor: number, expected: string }[] = [
			{ string: 'foo', cursor: 0, expected: '' },
			{ string: ' \tF', cursor: 0, expected: ' \t' },
			{ string: ' \t', cursor: 0, expected: ' \t' },
		]
		for (const { string, cursor, expected } of suites) {
			it(`Should return '${showWhiteSpaceGlyph(expected)}' for ${markOffsetInString(string, cursor)}`, () => {
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
	describe('static', () => {
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
				it(`Should return ${expected} for '${showWhiteSpaceGlyph(c)}'`, () => {
					const actual = Source.isSpace(c)
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
				it(`Should return ${expected} for '${showWhiteSpaceGlyph(c)}'`, () => {
					const actual = Source.isNewline(c)
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
				it(`Should return ${expected} for '${showWhiteSpaceGlyph(c)}'`, () => {
					const actual = Source.isWhitespace(c)
					assert.strictEqual(actual, expected)
				})
			}
		})
	})
})
