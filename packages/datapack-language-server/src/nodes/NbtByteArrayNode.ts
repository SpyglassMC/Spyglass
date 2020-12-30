import { NodeType } from './ArgumentNode'
import { NbtArrayNode } from './NbtArrayNode'
import { NbtByteNode } from './NbtByteNode'
import { NbtNodeType } from './NbtNode'

const NbtByteArrayChars = { openBracket: '[', type: 'B', sep: ',', closeBracket: ']' }

export class NbtByteArrayNode extends NbtArrayNode<NbtByteNode> {
	readonly [NodeType] = 'NbtByteArray'
	readonly [NbtNodeType] = 'ByteArray'
	protected readonly chars = NbtByteArrayChars
}
