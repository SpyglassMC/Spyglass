import assert from 'assert'
import snapshot from "snap-shot-it"
import { it, describe } from "mocha"
import { Position } from '../../lib/types/Position'

describe('Position', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Position.create(1, 2))
			snapshot(Position.create({}))
			snapshot(Position.create({ line: 1 }))
			snapshot(Position.create({ character: 2 }))
			snapshot(Position.create({ line: 1, character: 2 }))
		})
	})
	describe('toString()', () => {
		it('Should work for regular numbers', () => {
			assert.strictEqual(Position.toString(Position.Beginning), '(0, 0)')
		})
		it('Should work for Infinity', () => {
			assert.strictEqual(Position.toString(Position.Infinity), '(Infinity, Infinity)')
		})
	})
	describe('constants', () => {
		it('Should initialize correctly', () => {
			snapshot(Position.Beginning)
			snapshot(Position.Infinity)
		})
	})
})
