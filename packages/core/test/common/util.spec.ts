import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
	type AstNode,
	type CommentNode,
	type DeepReadonly,
	type InheritReadonly,
	normalizeUri,
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
})
