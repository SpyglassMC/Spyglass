import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { AstNode, CommentNode, DeepReadonly, InheritReadonly } from '../../lib/index.js'
import {
	max,
	min,
	normalizeUri,
	numericEquals,
	tryConvertToNumberWithoutPrecisionLoss,
} from '../../lib/index.js'
import { assertType, typing } from '../utils.ts'

describe('common util', () => {
	describe('normalizeUri()', () => {
		describe('Should normalize drive letters', () => {
			const Tests = [
				'file:///c:/project/readme.md',
				'file:///C:/project/readme.md',
				'file:///c%3a/project/readme.md',
				'file:///C%3a/project/readme.md',
				'file:///c%3A/project/readme.md',
				'file:///C%3A/project/readme.md',
			]
			for (const testUri of Tests) {
				it(testUri, () => {
					const actual = normalizeUri(testUri)
					assert.equal(actual, 'file:///c:/project/readme.md')
				})
			}
		})
		describe('Should noop for non-drive letters', () => {
			const Tests = [
				'file:///project/readme.md',
				'file:///project/C:/whatareyoudoinghere.md',
			]
			for (const testUri of Tests) {
				it(testUri, () => {
					const actual = normalizeUri(testUri)
					assert.equal(actual, testUri)
				})
			}
		})
		it('Should use non-encoded form of colons everywhere', () => {
			const actual = normalizeUri('file:///project/foo%3abar%3Aqux')
			assert.equal(actual, 'file:///project/foo:bar:qux')
		})
	})

	typing('InheritReadonly', () => {
		type UndefinedNode = InheritReadonly<CommentNode, undefined>
		type ReadonlyNode = InheritReadonly<CommentNode, DeepReadonly<AstNode>>
		type ReadWriteNode = InheritReadonly<CommentNode, AstNode>
		assertType<never>(0 as unknown as UndefinedNode)
		assertType<DeepReadonly<CommentNode>>(0 as unknown as ReadonlyNode)
		assertType<CommentNode>(0 as unknown as ReadWriteNode)
	})

	describe('numericEquals()', () => {
		const suites: [number | bigint | undefined, number | bigint | undefined][] = [
			[91, 91],
			[91, 91n],
			[91n, 91n],
			[9, 1],
			[9, 1n],
			[0, undefined],
			[919191919191919191919191, 919191919191919191919191n],
		]
		for (const [a, b] of suites) {
			it(`${numericToString(a)} & ${numericToString(b)}`, (t) => {
				const result = numericEquals(a, b)
				t.assert.snapshot(result)
			})
		}
	})

	describe('tryConvertToNumberWithoutPrecisionLoss()', () => {
		const suites: (number | bigint | undefined)[] = [
			91,
			91n,
			919191919191919191919191,
			919191919191919191919191n,
			undefined,
		]
		for (const n of suites) {
			it(numericToString(n) ?? 'undefined', (t) => {
				const result = tryConvertToNumberWithoutPrecisionLoss(n)
				t.assert.snapshot(numericToString(result))
			})
		}
	})

	describe('min()', () => {
		const suites: [number | bigint, number | bigint][] = [
			[91, 91],
			[9, 1],
			[1, 9],
			[9, 1n],
			[9n, 1],
		]
		for (const [a, b] of suites) {
			it(`${numericToString(a)} & ${numericToString(b)}`, (t) => {
				const result = min(a, b)
				t.assert.snapshot(numericToString(result))
			})
		}
	})

	describe('max()', () => {
		const suites: [number | bigint, number | bigint][] = [
			[91, 91],
			[9, 1],
			[1, 9],
			[9, 1n],
			[9n, 1],
		]
		for (const [a, b] of suites) {
			it(`${numericToString(a)} & ${numericToString(b)}`, (t) => {
				const result = max(a, b)
				t.assert.snapshot(numericToString(result))
			})
		}
	})
})

function numericToString(n: number | bigint | undefined) {
	return typeof n === 'bigint' ? `${n}n` : n?.toString()
}
