import { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { AstNode, Range, traverseLeaves } from '../../lib'

const TestNode: AstNode = {
	type: 'not_leaf_1',
	range: Range.create(0, 10),
	children: [
		{
			type: 'leaf_1',
			range: Range.create(0, 5),
		},
		{
			type: 'not_leaf_2',
			range: Range.create(5, 10),
			children: [
				{
					type: 'not_leaf_3',
					range: Range.create(5, 8),
					children: [
						{
							type: 'leaf_2',
							range: Range.create(5, 6),
						},
						{
							type: 'leaf_3',
							range: Range.create(6, 8),
						},
					],
				},
				{
					type: 'leaf_4',
					range: Range.create(9, 10),
				},
			],
		},
	],
}

describe('processor/util.ts', () => {
	describe('traverseLeaves()', () => {
		it('Should traverse every leaf', () => {
			traverseLeaves(
				TestNode,
				(leaf, parents) => snapshot({
					leaf: leaf.type,
					parents: parents.map(p => p.type),
				})
			)
		})
		it('Should not traverse at all if the provided range [10, 10) does not intersect with any node', () => {
			traverseLeaves(
				TestNode,
				fail,
				Range.create(10, 10)
			)
		})
		const suites: Range[] = [
			Range.create(0, 10),
			Range.create(4, 5),
			Range.create(5, 7),
			Range.create(6, 7),
			Range.create(7, 10),
		]
		for (const suite of suites) {
			it(`Should traverse every leaf in ${Range.toString(suite)}`, () => {
				traverseLeaves(
					TestNode,
					(leaf, parents) => snapshot({
						leaf: leaf.type,
						parents: parents.map(p => p.type),
					}),
					suite
				)
			})
		}
	})
})
