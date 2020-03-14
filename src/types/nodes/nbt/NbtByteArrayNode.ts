import { NbtNodeType } from './NbtNode'
import NbtByteNode from './NbtByteNode'
import NbtArrayNode from './NbtArrayNode'
import { NodeType } from '../ArgumentNode'

const NbtByteArrayChars = { openBracket: '[', type: 'B', sep: ',', closeBracket: ']' }

export default class NbtByteArrayNode extends NbtArrayNode<NbtByteNode> {
    readonly [NodeType] = 'NbtByteArray'
    readonly [NbtNodeType] = 'ByteArray'
    protected readonly chars = NbtByteArrayChars
}
