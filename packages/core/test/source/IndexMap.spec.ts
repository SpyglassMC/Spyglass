import { strict as assert } from 'assert'
import { describe, it } from 'node:test'
import { IndexMap, Range } from '../../lib/index.js'

describe('IndexMap', () => {
	describe('to<Inner/Outer>Offset', () => {
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
		const toInnerCases: { input: number; expected: number }[] = [
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
		const toOuterCases: { input: number; expected: number }[] = [
			{ input: 0, expected: 13 },
			{ input: 1, expected: 14 },
			{ input: 2, expected: 15 },
			{ input: 3, expected: 16 },
			{ input: 4, expected: 18 },
			{ input: 5, expected: 19 },
			{ input: 6, expected: 20 },
			{ input: 7, expected: 21 },
			{ input: 8, expected: 27 },
			{ input: 9, expected: 28 },
			{ input: 10, expected: 29 },
			{ input: 11, expected: 30 },
		]
		for (const method of ['toInnerOffset', 'toOuterOffset'] as const) {
			describe(`${method}()`, () => {
				for (
					const { input, expected } of method === 'toInnerOffset'
						? toInnerCases
						: toOuterCases
				) {
					it(`Should return ${expected} for ${input}`, () => {
						const actual = IndexMap[method](map, input)
						assert.strictEqual(actual, expected)
					})
				}
			})
		}
	})

	describe('to<Inner/Outer>Range', () => {
		describe('foo"bar§qux <=> foo\\"bar\\u00a7qux', () => {
			/*
			 * Index Tens - 000000000011111111112
			 * Index Ones - 012345678901234567890
			 * Outer      - foo\"bar\u00a7qux
			 * Inner      - foo"bar§qux
			 */
			const indexMap = [
				{ inner: Range.create(3, 4), outer: Range.create(3, 5) },
				{ inner: Range.create(7, 8), outer: Range.create(8, 14) },
			]
			const toInnerCases = [
				{ input: Range.create(0, 1), expected: Range.create(0, 1), name: '`f` -> `f`' },
				{ input: Range.create(3, 5), expected: Range.create(3, 4), name: '`\\"` -> `"`' },
				{ // (shifted left)
					input: Range.create(7, 8),
					expected: Range.create(6, 7),
					name: '`r` -> `r`',
				},
				{ input: Range.create(8, 14), expected: Range.create(7, 8), name: '`\\u00a7` -> `§`' },
				{
					input: Range.create(7, 14),
					expected: Range.create(6, 8),
					name: '`r\\u00a7` -> `r§`',
				},
				{ input: Range.create(7, 12), expected: Range.create(6, 7), name: '`r\\u00` -> `r`' },
				{
					input: Range.create(7, 15),
					expected: Range.create(6, 9),
					name: '`r\\u00a7q` -> `r§q`',
				},
			]
			const toOuterCases = [
				{ input: Range.create(0, 1), expected: Range.create(0, 1), name: '`f` -> `f`' },
				{ input: Range.create(3, 4), expected: Range.create(3, 5), name: '`"` -> `"`' },
				{ // (shifted right)
					input: Range.create(6, 7),
					expected: Range.create(7, 8),
					name: '`r` -> `r`',
				},
				{ input: Range.create(7, 8), expected: Range.create(8, 14), name: '`§` -> `\\u00a7`' },
				{
					input: Range.create(6, 8),
					expected: Range.create(7, 14),
					name: '`r§` -> `r\\u00a7`',
				},
				{
					input: Range.create(6, 9),
					expected: Range.create(7, 15),
					name: '`r§q` -> `r\\u00a7`',
				},
			]
			for (const method of ['toInnerRange', 'toOuterRange'] as const) {
				describe(`${method}()`, () => {
					for (
						const { input, expected, name } of method === 'toInnerRange'
							? toInnerCases
							: toOuterCases
					) {
						it(`Should convert ${Range.toString(input)} to ${Range.toString(expected)} (${name})`, () => {
							const actual = IndexMap[method](indexMap, input)
							assert.deepEqual(actual, expected)
						})
					}
				})
			}
		})
	})
})
