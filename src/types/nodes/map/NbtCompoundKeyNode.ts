import { ToFormattedString } from '../../Formattable'
import { NodeType, NodeDescription } from '../ArgumentNode'
import { NbtNodeType } from '../nbt/NbtNode'
import NbtStringNode from '../nbt/NbtStringNode'
import NbtCompoundNode from './NbtCompoundNode'
import TextRange from '../../TextRange'

export default class NbtCompoundKeyNode extends NbtStringNode {
    readonly [NodeType] = 'NbtCompoundKey'
    readonly [NbtNodeType] = 'String';

    [NodeDescription]: string

    constructor(
        range: TextRange, superNbt: NbtCompoundNode, value: string, raw: string
    ) {
        super(range, superNbt, value, raw)
    }

    [ToFormattedString]() {
        return this.toString()
    }
}
