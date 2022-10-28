import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { AstNode, Range } from '../../lib/index.js'

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

const DiscontinuousTestNode: AstNode = {
	type: 'not_leaf_1',
	range: Range.create(0, 10),
	children: [
		{
			type: 'not_leaf_2',
			range: Range.create(0, 6),
			children: [
				{
					type: 'leaf_1',
					range: Range.create(0, 2),
				},
				{
					type: 'leaf_2',
					range: Range.create(4, 6),
				},
			],
		},
		{
			type: 'not_leaf_4',
			range: Range.create(9, 10),
		},
	],
}

describe('AstNode', () => {
	describe('findDeepestChild', () => {
		describe('continuous', () => {
			const suites: number[] = [0, 1, 5, 7, 9, 12]
			for (const suite of suites) {
				it(`Should return the node at ${suite}`, () => {
					const node = AstNode.findDeepestChild({
						node: TestNode,
						needle: suite,
					})
					snapshot(
						node
							? {
									node: node.type,
							  }
							: 'undefined',
					)
				})
			}
		})
		describe('discontinuous', () => {
			const suites: number[] = [0, 3, 7, 12]
			for (const suite of suites) {
				it(`Should return the node at ${suite}`, () => {
					const node = AstNode.findDeepestChild({
						node: DiscontinuousTestNode,
						needle: suite,
					})
					snapshot(
						node
							? {
									node: node.type,
							  }
							: 'undefined',
					)
				})
			}
		})
	})
})
