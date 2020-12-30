import assert from 'assert'
import snapshot from 'snap-shot-it'
import { it, describe } from 'mocha'
import { Position } from '../../lib/types/Position'
import { PositionRange } from '../../lib/types/PositionRange'

describe('PositionRange', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(PositionRange.create(1, 2, 3, 4))
			snapshot(PositionRange.create(Position.create(1, 2), Position.create(3, 4)))
			snapshot(PositionRange.create({}))
			snapshot(PositionRange.create({ start: Position.create(1, 2) }))
			snapshot(PositionRange.create({ end: Position.create(3, 4) }))
			snapshot(PositionRange.create({ start: Position.create(1, 2), end: Position.create(3, 4) }))
		})
		it('Should create a new object from the passed-in Range', () => {
			const incoming = PositionRange.create(1, 2, 3, 4)

			const result = PositionRange.create(incoming)
			incoming.start = Position.Beginning

			assert.deepStrictEqual(result, PositionRange.create(1, 2, 3, 4))
		})
	})
	describe('toString()', () => {
		it('Should work for regular numbers', () => {
			assert.strictEqual(PositionRange.toString(PositionRange.Beginning), '[<0, 0>, <0, 1>)')
		})
		it('Should work for Infinity', () => {
			assert.strictEqual(PositionRange.toString(PositionRange.Full), '[<0, 0>, <Infinity, Infinity>)')
		})
	})
	describe('endsBefore()', () => {
		const pos = Position.create(4, 2)
		const suites: { name: string, range: PositionRange, expected: boolean }[] = [
			{ name: 'ranges ending before the line', range: PositionRange.create(0, 0, 3, 5), expected: true },
			{ name: 'ranges ending within the line and before the character', range: PositionRange.create(0, 0, 4, 1), expected: true },
			{ name: 'ranges ending within the line and at the character', range: PositionRange.create(0, 0, 4, 2), expected: true },
			{ name: 'ranges ending within the line and after the character', range: PositionRange.create(0, 0, 4, 3), expected: false },
			{ name: 'ranges ending after the line', range: PositionRange.create(0, 0, 5, 1), expected: false },
		]
		for (const { name, range, expected } of suites) {
			it(`Should return ${expected} for ${name}`, () => {
				const actual = PositionRange.endsBefore(range, pos)
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('contains()', () => {
		const suites = [
			{
				range: PositionRange.create(1, 2, 1, 4),
				cases: [
					{ pos: Position.create(0, 3), expected: false },
					{ pos: Position.create(1, 1), expected: false },
					{ pos: Position.create(1, 2), expected: true },
					{ pos: Position.create(1, 3), expected: true },
					{ pos: Position.create(1, 4), expected: false },
					{ pos: Position.create(2, 3), expected: false },
				],
			},
			{
				range: PositionRange.create(1, 2, 3, 4),
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
				],
			},
			{
				range: PositionRange.Full,
				cases: [
					{ pos: Position.create(4, 2), expected: true },
				],
			},
		] as const
		for (const { range, cases } of suites) {
			describe(`range ${PositionRange.toString(range)}`, () => {
				for (const { pos, expected } of cases) {
					it(`Should return ${expected} for ${Position.toString(pos)}`, () => {
						const actual = PositionRange.contains(range, pos)
						assert.strictEqual(actual, expected)
					})
				}
			})
		}
	})
	describe('constants', () => {
		it('Should initialize correctly', () => {
			snapshot(PositionRange.Beginning)
			snapshot(PositionRange.Full)
		})
	})
})
