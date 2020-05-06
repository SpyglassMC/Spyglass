import { NodeType } from './ArgumentNode'
import { NbtArrayNode } from './NbtArrayNode'
import { NbtIntNode } from './NbtIntNode'
import { NbtNodeType } from './NbtNode'

const NbtIntArrayChars = { openBracket: '[', type: 'I', sep: ',', closeBracket: ']' }

export class NbtIntArrayNode extends NbtArrayNode<NbtIntNode> {
    readonly [NodeType] = 'NbtIntArray'
    readonly [NbtNodeType] = 'IntArray'
    protected readonly chars = NbtIntArrayChars
}
