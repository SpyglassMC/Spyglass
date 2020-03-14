import { NbtNodeType } from './NbtNode'
import NbtLongNode from './NbtLongNode'
import NbtArrayNode from './NbtArrayNode'
import { NodeType } from '../ArgumentNode'

const NbtLongArrayChars = { openBracket: '[', type: 'L', sep: ',', closeBracket: ']' }

export default class NbtLongArrayNode extends NbtArrayNode<NbtLongNode> {
    readonly [NodeType] = 'NbtLongArray'
    readonly [NbtNodeType] = 'LongArray'
    protected readonly chars = NbtLongArrayChars
}
