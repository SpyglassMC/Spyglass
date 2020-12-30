import { NodeType } from './ArgumentNode'
import { NbtArrayNode } from './NbtArrayNode'
import { NbtLongNode } from './NbtLongNode'
import { NbtNodeType } from './NbtNode'

const NbtLongArrayChars = { openBracket: '[', type: 'L', sep: ',', closeBracket: ']' }

export class NbtLongArrayNode extends NbtArrayNode<NbtLongNode> {
	readonly [NodeType] = 'NbtLongArray'
	readonly [NbtNodeType] = 'LongArray'
	protected readonly chars = NbtLongArrayChars
}
