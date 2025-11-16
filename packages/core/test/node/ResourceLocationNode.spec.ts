import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ResourceLocationNode } from '../../lib/index.js'
import { showWhitespaceGlyph } from '../utils.ts'

describe('ResourceLocationNode', () => {
	describe('toString()', () => {
		const suites: {
			node: Partial<ResourceLocationNode>
			type: 'origin' | 'full' | 'short' | undefined
			includesTagPrefix?: boolean
			expected: string
		}[] = [
			{ node: {}, type: 'origin', expected: '' },
			{ node: {}, type: 'full', expected: 'minecraft:' },
			{ node: {}, type: 'short', expected: '' },
			{ node: { path: ['foo'] }, type: 'origin', expected: 'foo' },
			{ node: { path: ['foo'] }, type: 'full', expected: 'minecraft:foo' },
			{ node: { path: ['foo'] }, type: 'short', expected: 'foo' },
			{ node: { path: ['foo', 'bar'] }, type: 'origin', expected: 'foo/bar' },
			{ node: { path: ['foo', 'bar'] }, type: 'full', expected: 'minecraft:foo/bar' },
			{ node: { path: ['foo', 'bar'] }, type: 'short', expected: 'foo/bar' },
			{ node: { namespace: '', path: ['foo'] }, type: undefined, expected: ':foo' },
			{ node: { namespace: '', path: ['foo'] }, type: 'full', expected: 'minecraft:foo' },
			{ node: { namespace: '', path: ['foo'] }, type: 'short', expected: 'foo' },
			{
				node: { namespace: 'minecraft', path: ['foo'] },
				type: 'origin',
				expected: 'minecraft:foo',
			},
			{
				node: { namespace: 'minecraft', path: ['foo'] },
				type: 'full',
				expected: 'minecraft:foo',
			},
			{ node: { namespace: 'minecraft', path: ['foo'] }, type: 'short', expected: 'foo' },
			{
				node: { namespace: 'spgoding', path: ['foo'] },
				type: 'origin',
				expected: 'spgoding:foo',
			},
			{ node: { namespace: 'spgoding', path: ['foo'] }, type: 'full', expected: 'spgoding:foo' },
			{
				node: { namespace: 'spgoding', path: ['foo'] },
				type: 'short',
				expected: 'spgoding:foo',
			},
			{ node: { isTag: true, path: ['foo', 'bar'] }, type: 'origin', expected: 'foo/bar' },
			{
				node: { isTag: true, path: ['foo', 'bar'] },
				type: 'full',
				expected: 'minecraft:foo/bar',
			},
			{ node: { isTag: true, path: ['foo', 'bar'] }, type: 'short', expected: 'foo/bar' },
			{
				node: { isTag: true, path: ['foo', 'bar'] },
				type: 'origin',
				includesTagPrefix: true,
				expected: '#foo/bar',
			},
			{
				node: { isTag: true, path: ['foo', 'bar'] },
				type: 'full',
				includesTagPrefix: true,
				expected: '#minecraft:foo/bar',
			},
			{
				node: { isTag: true, path: ['foo', 'bar'] },
				type: 'short',
				includesTagPrefix: true,
				expected: '#foo/bar',
			},
		]
		for (const { node, type, includesTagPrefix, expected } of suites) {
			it(`It should convert to '${showWhitespaceGlyph(expected)}'`, () => {
				const actual = ResourceLocationNode.toString(
					node as ResourceLocationNode,
					type,
					includesTagPrefix,
				)
				assert.strictEqual(actual, expected)
			})
		}
	})
})
