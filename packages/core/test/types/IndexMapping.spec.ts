import snapshot from "snap-shot-it"
import { it, describe } from "mocha"
import { IndexMapping } from '../../lib/types/IndexMapping'

describe('IndexMapping', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(
				IndexMapping.create,
				undefined,
				{},
				{ start: { line: 1, character: 2 } },
				{ merges: [{ from: { line: 1, character: 3 }, to: { line: 1, character: 4 } }] },
				{ start: { line: 1, character: 2 }, merges: [{ from: { line: 1, character: 3 }, to: { line: 1, character: 4 } }] }
			)
		})
	})
})
