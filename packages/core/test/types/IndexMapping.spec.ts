import snapshot from 'snap-shot-it'
import { it, describe } from 'mocha'
import { IndexMapping } from '../../lib/types/IndexMapping'
import { Position } from '../../lib/types/Position'
import { Range } from '../../lib/types/Range'

describe('IndexMapping', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(
				IndexMapping.create,
				undefined,
				{},
				{ start: { line: 2, character: 2 } },
				{ merges: [{ start: { line: 1, character: 3 }, end: { line: 1, character: 4 } }] },
				{ start: { line: 1, character: 2 }, merges: [{ start: { line: 1, character: 3 }, end: { line: 1, character: 4 } }] }
			)
		})
	})
	describe('toInnerPos() & toOuterPos()', () => {
		it('Should work for escapes', () => {
			/*
			 * Index Tens - 000000000011111111112222222222
			 * Index Ones - 012345678901234567890123456789
			 * Outer      - "foo\"bar"
			 * Inner      - foo"bar
			 */
			const mapping = IndexMapping.create({
				start: Position.create({}),
				merges: [Range.create({})]
			})
			const toInnerTester = (char: number) => IndexMapping.toInnerPos(mapping, Position.create({ character: char }))
			const toOuterTester = (char: number) => IndexMapping.toOuterPos(mapping, Position.create({ character: char }))
			snapshot(
				toInnerTester,
				1, 2, 3, 4, 5, 6, 7
			)
			snapshot(
				toOuterTester,
				0, 1, 2, 3, 4, 5, 6
			)
		})
	})
})
