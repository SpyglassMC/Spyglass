import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { AstNode } from '../../lib/index.js'
import { Range, traversePreOrder } from '../../lib/index.js'

const TestNode: AstNode = {
	type: 'not_leaf_1',
	range: Range.create(0, 10),
	children: [{ type: 'leaf_1', range: Range.create(0, 5) }, {
		type: 'not_leaf_2',
		range: Range.create(5, 10),
		children: [{
			type: 'not_leaf_3',
			range: Range.create(5, 8),
			children: [{ type: 'leaf_2', range: Range.create(5, 6) }, {
				type: 'leaf_3',
				range: Range.create(6, 8),
			}],
		}, { type: 'leaf_4', range: Range.create(9, 10) }],
	}],
}

const DiscontinuousTestNode: AstNode = {
	type: 'not_leaf_1',
	range: Range.create(0, 10),
	children: [{
		type: 'not_leaf_2',
		range: Range.create(0, 6),
		children: [{ type: 'leaf_1', range: Range.create(0, 2) }, {
			type: 'leaf_2',
			range: Range.create(4, 6),
		}],
	}, { type: 'not_leaf_4', range: Range.create(9, 10) }],
}

describe('processor/util.ts', () => {
	describe('traversePreOrder()', () => {
		it('Should traverse nodes that match the predicates', () => {
			traversePreOrder(
				TestNode,
				(_) => true,
				(node) => node.type === 'leaf_1' || node.type === 'not_leaf_3',
				(node, parents) => snapshot({ node: node.type, parents: parents.map((p) => p.type) }),
			)
		})
	})
})
