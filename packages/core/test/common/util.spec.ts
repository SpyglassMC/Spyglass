import { describe, it } from 'mocha'
import type {
	AstNode,
	CommentNode,
	DeepReadonly,
	PotentiallyReadonly,
} from '../../lib'
import { assertType, typing } from '../utils.js'

describe('common util', () => {
	typing('PotentiallyReadonly', () => {
		type UndefinedNode = PotentiallyReadonly<CommentNode, undefined>
		type ReadonlyNode = PotentiallyReadonly<
			CommentNode,
			DeepReadonly<AstNode>
		>
		type ReadWriteNode = PotentiallyReadonly<CommentNode, AstNode>
		assertType<never>(0 as unknown as UndefinedNode)
		assertType<DeepReadonly<CommentNode>>(0 as unknown as ReadonlyNode)
		assertType<CommentNode>(0 as unknown as ReadWriteNode)
	})
})
