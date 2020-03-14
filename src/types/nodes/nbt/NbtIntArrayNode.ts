import { NbtNodeType } from './NbtNode'
import NbtIntNode from './NbtIntNode'
import NbtArrayNode from './NbtArrayNode'
import { NodeType } from '../ArgumentNode'

const NbtIntArrayChars = { openBracket: '[', type: 'I', sep: ',', closeBracket: ']' }

export default class NbtIntArrayNode extends NbtArrayNode<NbtIntNode> {
    readonly [NodeType] = 'NbtIntArray'
    readonly [NbtNodeType] = 'IntArray'
    protected readonly chars = NbtIntArrayChars
}
