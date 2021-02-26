import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { Location, Range } from '../../lib'

describe('Location', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Location.create({}))
			snapshot(Location.create({ uri: 'file:///home/spgoding/test' }))
			snapshot(Location.create({ range: Range.create(1, 2) }))
			snapshot(Location.create({ uri: 'file:///home/spgoding/test', range: Range.create(1, 2) }))
		})
		it('Should create a new object from the passed-in Position', () => {
			const incoming = Location.create({ range: Range.create(1, 2) })

			const result = Location.create(incoming)
			incoming.range = Range.create(9, 9)

			assert.deepStrictEqual(result, Location.create({ range: Range.create(1, 2) }))
		})
	})
})
