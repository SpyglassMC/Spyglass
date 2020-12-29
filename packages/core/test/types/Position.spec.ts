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
})
