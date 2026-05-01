import { describe, it } from 'node:test'
import type { AstNode, CommentNode, DeepReadonly, InheritReadonly } from '../../lib/index.js'
import { max, min, numericEquals, tryConvertToNumberWithoutPercisionLoss } from '../../lib/index.js'
import { assertType, typing } from '../utils.ts'

describe('common util', () => {
	typing('InheritReadonly', () => {
		type UndefinedNode = InheritReadonly<CommentNode, undefined>
		type ReadonlyNode = InheritReadonly<CommentNode, DeepReadonly<AstNode>>
		type ReadWriteNode = InheritReadonly<CommentNode, AstNode>
		assertType<never>(0 as unknown as UndefinedNode)
		assertType<DeepReadonly<CommentNode>>(0 as unknown as ReadonlyNode)
		assertType<CommentNode>(0 as unknown as ReadWriteNode)
	})

	describe('numericEquals()', () => {
		const suites: [number | bigint, number | bigint][] = [
			[91, 91],
			[91, 91n],
			[91n, 91n],
			[9, 1],
			[9, 1n],
		]
		for (const [a, b] of suites) {
			it(`${numericToString(a)} & ${numericToString(b)}`, (t) => {
				const result = numericEquals(a, b)
				t.assert.snapshot(result)
			})
		}
	})

	describe('tryConvertToNumberWithoutPercisionLoss()', () => {
		const suites: (number | bigint)[] = [
			91,
			91n,
			919191919191919191919191,
			919191919191919191919191n,
		]
		for (const n of suites) {
			it(numericToString(n), (t) => {
				const result = tryConvertToNumberWithoutPercisionLoss(n)
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

function numericToString(n: number | bigint) {
	return typeof n === 'number' ? n.toString() : `${n}n`
}
