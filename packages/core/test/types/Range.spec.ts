import assert from 'assert'
import { describe, it } from "mocha"
import snapshot from "snap-shot-it"
import { Range } from '../../lib/types/Range'

describe('Range', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Range.create(1, 2))
			snapshot(Range.create({}))
			snapshot(Range.create({ start: 1 }))
			snapshot(Range.create({ end: 2 }))
			snapshot(Range.create({ start: 1, end: 2 }))
		})
		it('Should create a new object from the passed-in Range', () => {
			const incoming = Range.create(1, 2)

			const result = Range.create(incoming)
			incoming.start = 0

			assert.deepStrictEqual(result, Range.create(1, 2))
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
		it(`Should return correctly`, () => {
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
					{ offset: 3, expected: false }
				]
			},
			{
				range: Range.Full,
				cases: [
					{ offset: 4, expected: true },
				]
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
	describe('constants', () => {
		it('Should initialize correctly', () => {
			snapshot(Range.Beginning)
			snapshot(Range.Full)
		})
	})
})
