import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { IndexMap, Range } from '../../lib'

describe('IndexMap', () => {
	/*
	 * Index Tens - 0000000000111111111122222222223
	 * Index Ones - 0123456789012345678901234567890
	 * Outer      -             "foo\"bar\u00a7qux"
	 * Inner      - foo"bar§qux
	 */
	const map: IndexMap = [
		{ outer: Range.create(13, 13), inner: Range.create(0, 0) },
		{ outer: Range.create(16, 18), inner: Range.create(3, 4) },
		{ outer: Range.create(21, 27), inner: Range.create(7, 8) },
	]
	const toInnerCases: { input: number, expected: number }[] = [
		{ input: 13, expected: 0 },
		{ input: 14, expected: 1 },
		{ input: 15, expected: 2 },
		{ input: 16, expected: 3 },
		{ input: 17, expected: 3 },
		{ input: 18, expected: 4 },
		{ input: 19, expected: 5 },
		{ input: 20, expected: 6 },
		{ input: 21, expected: 7 },
		{ input: 22, expected: 7 },
		{ input: 23, expected: 7 },
		{ input: 24, expected: 7 },
		{ input: 25, expected: 7 },
		{ input: 26, expected: 7 },
		{ input: 27, expected: 8 },
		{ input: 28, expected: 9 },
		{ input: 29, expected: 10 },
		{ input: 30, expected: 11 },
	]
	const toOuterCases: { input: number, expected: number }[] = [
		{ input: 0, expected: 13 },
		{ input: 1, expected: 14 },
		{ input: 2, expected: 15 },
		{ input: 3, expected: 17 },
		{ input: 4, expected: 18 },
		{ input: 5, expected: 19 },
		{ input: 6, expected: 20 },
		{ input: 7, expected: 26 },
		{ input: 8, expected: 27 },
		{ input: 9, expected: 28 },
		{ input: 10, expected: 29 },
		{ input: 11, expected: 30 },
	]
	for (const method of ['toInnerOffset', 'toOuterOffset'] as const) {
		describe(`${method}()`, () => {
			for (const { input, expected } of (method === 'toInnerOffset' ? toInnerCases : toOuterCases)) {
				it(`Should return ${expected} for ${input}`, () => {
					const actual = IndexMap[method](map, input)
					assert.strictEqual(actual, expected)
				})
			}
		})
	}

	/*
	 * Index Tens - 0000000000111111111122222222223333333333
	 * Index Ones - 0123456789012345678901234567890123456789
	 * Outer      -        [helloworld::"foo\"bar\u00a7qux"]
	 * Middle     - helloworld::"foo\"bar\u00a7qux"
	 * Inner      - foo"bar§qux
	 */
	const outerMap: IndexMap = [{ outer: Range.create(8, 8), inner: Range.create(0, 0) }]
	const innerMap: IndexMap = [
		{ outer: Range.create(13, 13), inner: Range.create(0, 0) },
		{ outer: Range.create(16, 18), inner: Range.create(3, 4) },
		{ outer: Range.create(21, 27), inner: Range.create(7, 8) },
	]
	describe('merge()', () => {
		it('Should merge correctly', () => {
			const mergedMap = IndexMap.merge(outerMap, innerMap)
			snapshot(mergedMap)
		})
	})
})
