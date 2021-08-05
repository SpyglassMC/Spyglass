import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { AstNode } from '../../lib'
import { findNode, Range, selectedNode, traversePreOrder } from '../../lib'

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

describe('processor/util.ts', () => {
	describe('traversePreOrder()', () => {
		it('Should traverse nodes that match the predicates', () => {
			traversePreOrder(
				TestNode,
				_ => true,
				node => node.type === 'leaf_1' || node.type === 'not_leaf_3',
				(node, parents) => snapshot({
					node: node.type,
					parents: parents.map(p => p.type),
				})
			)
		})
	})

	describe('selectedNode()', () => {
		describe('continuous', () => {
			const suites: number[] = [
				0,
				1,
				5,
				7,
				9,
				12,
			]
			for (const suite of suites) {
				it(`Should return the node at ${suite}`, () => {
					const { node, parents } = selectedNode(
						TestNode,
						suite,
					)
					snapshot(node ? {
						node: node.type,
						parents: parents.map(p => p.type),
					} : 'undefined')
				})
			}
		})
		describe('discontinuous', () => {
			const suites: number[] = [
				0,
				3,
				7,
				12,
			]
			for (const suite of suites) {
				it(`Should return the node at ${suite}`, () => {
					const { node, parents } = selectedNode(
						DiscontinuousTestNode,
						suite,
					)
					snapshot(node ? {
						node: node.type,
						parents: parents.map(p => p.type),
					} : 'undefined')
				})
			}
		})
	})

	describe('findNode()', () => {
		describe('continuous', () => {
			const suites: Range[] = [
				Range.create(0, 10),
				Range.create(5, 6),
				Range.create(9, 10),
			]
			for (const suite of suites) {
				it(`Should return the node at ${Range.toString(suite)}`, () => {
					const { node, parents } = findNode(
						TestNode,
						suite,
					)
					snapshot(node ? {
						node: node.type,
						parents: parents.map(p => p.type),
					} : 'undefined')
				})
			}
		})
		describe('discontinuous', () => {
			const suites: Range[] = [
				Range.create(0, 10),
				Range.create(0, 2),
				Range.create(9, 10),
			]
			for (const suite of suites) {
				it(`Should return the node at ${Range.toString(suite)}`, () => {
					const { node, parents } = findNode(
						DiscontinuousTestNode,
						suite,
					)
					snapshot(node ? {
						node: node.type,
						parents: parents.map(p => p.type),
					} : 'undefined')
				})
			}
		})
	})
})
