import { describe } from 'mocha'
import type { AstNode, CommentNode, DeepReadonly, InheritReadonly } from '../../lib'
import { assertType, typing } from '../utils.js'

describe('common util', () => {
	typing('InheritReadonly', () => {
		type UndefinedNode = InheritReadonly<CommentNode, undefined>
		type ReadonlyNode = InheritReadonly<
			CommentNode,
			DeepReadonly<AstNode>
		>
		type ReadWriteNode = InheritReadonly<CommentNode, AstNode>
		assertType<never>(0 as unknown as UndefinedNode)
		assertType<DeepReadonly<CommentNode>>(0 as unknown as ReadonlyNode)
		assertType<CommentNode>(0 as unknown as ReadWriteNode)
	})
})
