import assert from 'assert'
import snapshot from "snap-shot-it"
import { it, describe } from "mocha"
import { Position } from '../../lib/types/Position'
import { Range } from '../../lib/types/Range'

describe('Range', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Range.create(1, 2, 3, 4))
			snapshot(Range.create(Position.create(1, 2), Position.create(3, 4)))
			snapshot(Range.create({}))
			snapshot(Range.create({ start: Position.create(1, 2) }))
			snapshot(Range.create({ end: Position.create(3, 4) }))
			snapshot(Range.create({ start: Position.create(1, 2), end: Position.create(3, 4) }))
		})
	})
	describe('toString()', () => {
		it('Should work for regular numbers', () => {
			assert.strictEqual(Range.toString(Range.Beginning), '(0, 0)..(0, 1)')
		})
		it('Should work for Infinity', () => {
			assert.strictEqual(Range.toString(Range.Full), '(0, 0)..(Infinity, Infinity)')
		})
	})
	describe('isIn()', () => {
		const suites = [
			{
				range: Range.create(1, 2, 1, 4),
				cases: [
					{ pos: Position.create(0, 3), expected: false },
					{ pos: Position.create(1, 1), expected: false },
					{ pos: Position.create(1, 2), expected: true },
					{ pos: Position.create(1, 3), expected: true },
					{ pos: Position.create(1, 4), expected: false },
					{ pos: Position.create(2, 3), expected: false },
				]
			},
			{
				range: Range.create(1, 2, 3, 4),
				cases: [
					{ pos: Position.create(0, 3), expected: false },
					{ pos: Position.create(1, 1), expected: false },
					{ pos: Position.create(1, 2), expected: true },
					{ pos: Position.create(1, 3), expected: true },
					{ pos: Position.create(1, 4), expected: true },
					{ pos: Position.create(1, 5), expected: true },
					{ pos: Position.create(2, Infinity), expected: true },
					{ pos: Position.create(3, 1), expected: true },
					{ pos: Position.create(3, 2), expected: true },
					{ pos: Position.create(3, 3), expected: true },
					{ pos: Position.create(3, 4), expected: false },
					{ pos: Position.create(3, 5), expected: false },
					{ pos: Position.create(4, 3), expected: false },
				]
			},
			{
				range: Range.Full,
				cases: [
					{ pos: Position.create(4, 2), expected: true },
				]
			},
		] as const
		for (const { range, cases } of suites) {
			describe(`range ${Range.toString(range)}`, () => {
				for (const { pos, expected } of cases) {
					it(`Should return ${expected} for ${Position.toString(pos)}`, () => {
						const actual = Range.isIn(range, pos)
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
