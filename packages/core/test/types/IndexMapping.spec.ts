import assert from 'assert'
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
				{ innerRange: Range.Beginning, outerRange: Range.Beginning, mapping: [] },
			)
		})
	})
	describe('toInnerPos() & toOuterPos()', () => {
		const suites: { desc: string, mapping: IndexMapping, toInnerCases: { outer: Position, expected: Position }[], toOuterCases: { inner: Position, expected: Position }[] }[] = [
			{
				/*
				 * Index Tens - 000000000011111111112222222222
				 * Index Ones - 012345678901234567890123456789
				 * Outer (L1) - "foo\"bar"
				 * Inner (L0) - foo"bar
				 */
				desc: 'Should work for escapes',
				mapping: IndexMapping.create({
					outerRange: Range.create(1, 0, 1, 10),
					innerRange: Range.create(0, 0, 0, 7),
					mapping: [
						{ from: Range.create(1, 4, 1, 6), to: Range.create(0, 3, 0, 4) },
					]
				}),
				toInnerCases: [
					{ outer: Position.create(1, 0), expected: Position.create(0, 0) },
				],
				toOuterCases: [
					{ inner: Position.create(0, 0), expected: Position.create(1, 1) },
				]
			},
		]
		for (const { desc, mapping, toInnerCases, toOuterCases } of suites) {
			describe(desc, () => {
				describe('toInnerPos()', () => {
					for (const { outer, expected } of toInnerCases) {
						it(`Should return ${Position.toString(expected)} for ${Position.toString(outer)}`, () => {
							const actual = IndexMapping.toInnerPos(mapping, outer)
							assert.strictEqual(actual, expected)
						})
					}
				})
				describe('toOuterPos()', () => {
					for (const { inner, expected } of toOuterCases) {
						it(`Should return ${Position.toString(expected)} for ${Position.toString(inner)}`, () => {
							const actual = IndexMapping.toInnerPos(mapping, inner)
							assert.strictEqual(actual, expected)
						})
					}
				})
			})
		}
	})
})
