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
})
