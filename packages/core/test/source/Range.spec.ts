import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { AstNode} from '../../lib'
import { Range, RangeContainer, Source } from '../../lib'

describe('Range', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Range.create(1, 2))
			snapshot(Range.create(5))
			const src = new Source('')
			src.cursor = 6
			snapshot(Range.create(src))
			snapshot(Range.create(1, src))
			snapshot(Range.create(src, () => src.skip(2)))
		})
	})
	describe('get()', () => {
		it('Should clone a Range', () => {
			const actual = Range.get(Range.Beginning)
			assert.deepStrictEqual(actual, Range.Beginning)
			assert.notStrictEqual(actual, Range.Beginning)
		})
		it("Should clone an AstNode's Range", () => {
			const node: AstNode = { type: 'ast', range: Range.Beginning }
			const actual = Range.get(node)
			assert.deepStrictEqual(actual, node.range)
			assert.notStrictEqual(actual, node.range)
		})
		it("Should clone the function's return value", () => {
			const actual = Range.get(() => Range.Beginning)
			assert.deepStrictEqual(actual, Range.Beginning)
			assert.notStrictEqual(actual, Range.Beginning)
		})
	})
	describe('toString()', () => {
		it('Should work for regular numbers', () => {
			assert.strictEqual(Range.toString(Range.Beginning), '[0, 1)')
		})
		it('Should work for Infinity', () => {
			assert.strictEqual(Range.toString(Range.Full), '[0, Infinity)')
		})
	})
	describe('is()', () => {
		it('Should return false for null', () => {
			assert.strictEqual(Range.is(null), false)
		})
		it('Should return false for undefined', () => {
			assert.strictEqual(Range.is(undefined), false)
		})
		it('Should return false for primitives', () => {
			assert.strictEqual(Range.is(0), false)
			assert.strictEqual(Range.is(1), false)
			assert.strictEqual(Range.is(false), false)
			assert.strictEqual(Range.is(true), false)
			assert.strictEqual(Range.is(''), false)
		})
		it('Should return false for empty objects', () => {
			assert.strictEqual(Range.is({}), false)
		})
		it('Should return false for arrays', () => {
			assert.strictEqual(Range.is([1, 2]), false)
		})
		it('Should return false for keys with wrong type', () => {
			assert.strictEqual(Range.is({ start: undefined, end: 1 }), false)
		})
		it('Should return true for range', () => {
			assert.strictEqual(Range.is({ start: 1, end: 1 }), true)
		})
	})
	describe('endsBefore()', () => {
		const offset = 2
		const suites: { name: string, range: Range, expected: boolean }[] = [
			{ name: 'ranges ending before the offset', range: Range.create(0, 1), expected: true },
			{ name: 'ranges ending at the offset', range: Range.create(0, 2), expected: true },
			{ name: 'ranges ending after the offset', range: Range.create(0, 3), expected: false },
		]
		for (const { name, range, expected } of suites) {
			it(`Should return ${expected} for ${name}`, () => {
				const actual = Range.endsBefore(range, offset)
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('length()', () => {
		it('Should return correctly', () => {
			const range = Range.create(1, 2)
			const actual = Range.length(range)
			assert.strictEqual(actual, 1)
		})
	})
	describe('contains()', () => {
		const suites = [
			{
				range: Range.create(1, 2),
				cases: [
					{ offset: 0, expected: false },
					{ offset: 1, expected: true },
					{ offset: 2, expected: false },
					{ offset: 3, expected: false },
				],
			},
			{
				range: Range.Full,
				cases: [
					{ offset: 4, expected: true },
				],
			},
		] as const
		for (const { range, cases } of suites) {
			describe(`range ${Range.toString(range)}`, () => {
				for (const { offset, expected } of cases) {
					it(`Should return ${expected} for ${offset}`, () => {
						const actual = Range.contains(range, offset)
						assert.strictEqual(actual, expected)
					})
				}
			})
		}
	})
	describe('intersects()', () => {
		const suites = [
			{
				baseRange: Range.create(1, 3),
				cases: [
					{ range: Range.create(0, 1), expected: false },
					{ range: Range.create(1, 1), expected: true },
					{ range: Range.create(0, 2), expected: true },
					{ range: Range.create(1, 2), expected: true },
					{ range: Range.create(2, 2), expected: true },
					{ range: Range.create(1, 3), expected: true },
					{ range: Range.create(2, 3), expected: true },
					{ range: Range.create(3, 3), expected: false },
					{ range: Range.create(1, 4), expected: true },
					{ range: Range.create(2, 4), expected: true },
					{ range: Range.create(3, 4), expected: false },
					{ range: Range.create(4, 4), expected: false },
				],
			},
			{
				baseRange: Range.Full,
				cases: [
					{ range: Range.create(4, 4), expected: true },
				],
			},
		] as const
		for (const { baseRange, cases } of suites) {
			describe(`intersects ${Range.toString(baseRange)}`, () => {
				for (const { range, expected } of cases) {
					it(`Should return ${expected} for ${range}`, () => {
						const actual = Range.intersects(baseRange, range)
						assert.strictEqual(actual, expected)
					})
				}
			})
		}
	})
	describe('constants', () => {
		it('Should initialize correctly', () => {
			snapshot(Range.Beginning)
			snapshot(Range.Full)
		})
	})
})

describe('RangeContainer', () => {
	describe('is()', () => {
		it('Should return false for null', () => {
			assert.strictEqual(RangeContainer.is(null), false)
		})
		it('Should return false for undefined', () => {
			assert.strictEqual(RangeContainer.is(undefined), false)
		})
		it('Should return false for primitives', () => {
			assert.strictEqual(RangeContainer.is(0), false)
			assert.strictEqual(RangeContainer.is(1), false)
			assert.strictEqual(RangeContainer.is(false), false)
			assert.strictEqual(RangeContainer.is(true), false)
			assert.strictEqual(RangeContainer.is(''), false)
		})
		it('Should return false for empty objects', () => {
			assert.strictEqual(RangeContainer.is({}), false)
		})
		it('Should return false for arrays', () => {
			assert.strictEqual(RangeContainer.is([1, 2]), false)
		})
		it('Should return false for range', () => {
			assert.strictEqual(RangeContainer.is({ start: 1, end: 1 }), false)
		})
		it('Should return false for keys with wrong type', () => {
			assert.strictEqual(RangeContainer.is({ range: { start: undefined, end: 1 } }), false)
		})
		it('Should return true for range container', () => {
			assert.strictEqual(RangeContainer.is({ range: { start: 1, end: 1 } }), true)
		})
	})
})
