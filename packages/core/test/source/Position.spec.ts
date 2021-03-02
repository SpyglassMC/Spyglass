import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { Position } from '../../lib'

describe('Position', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Position.create(1, 2))
			snapshot(Position.create({}))
			snapshot(Position.create({ line: 1 }))
			snapshot(Position.create({ character: 2 }))
			snapshot(Position.create({ line: 1, character: 2 }))
		})
		it('Should create a new object from the passed-in Position', () => {
			const incoming = Position.create(4, 2)

			const result = Position.create(incoming)
			incoming.line = 0

			assert.deepStrictEqual(result, Position.create(4, 2))
		})
	})
	describe('toString()', () => {
		it('Should work for regular numbers', () => {
			assert.strictEqual(Position.toString(Position.Beginning), '<0, 0>')
		})
		it('Should work for Infinity', () => {
			assert.strictEqual(Position.toString(Position.Infinity), '<Infinity, Infinity>')
		})
	})
	describe('isBefore()', () => {
		const pos2 = Position.create(4, 2)
		const suites: { name: string, pos1: Position, expected: boolean }[] = [
			{ name: 'positions before the line', pos1: Position.create(3, 5), expected: true },
			{ name: 'positions within the line and before the character', pos1: Position.create(4, 1), expected: true },
			{ name: 'positions within the line and at the character', pos1: Position.create(4, 2), expected: false },
			{ name: 'positions within the line and after the character', pos1: Position.create(4, 3), expected: false },
			{ name: 'positions after the line', pos1: Position.create(5, 1), expected: false },
		]
		for (const { name, pos1, expected } of suites) {
			it(`Should return ${expected} for ${name}`, () => {
				const actual = Position.isBefore(pos1, pos2)
				assert.strictEqual(actual, expected)
			})
		}
	})
	describe('constants', () => {
		it('Should initialize correctly', () => {
			snapshot(Position.Beginning)
			snapshot(Position.Infinity)
		})
	})
})
