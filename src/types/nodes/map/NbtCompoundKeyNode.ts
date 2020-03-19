import { ToFormattedString } from '../../Formattable'
import { NodeType, NodeDescription } from '../ArgumentNode'
import { NbtNodeType } from '../nbt/NbtNode'
import NbtStringNode from '../nbt/NbtStringNode'
import NbtCompoundNode from './NbtCompoundNode'
import IndexMapping from '../../IndexMapping'

export default class NbtCompoundKeyNode extends NbtStringNode {
    readonly [NodeType] = 'NbtCompoundKey'
    readonly [NbtNodeType] = 'String';

    [NodeDescription]: string

    constructor(
        superNbt: NbtCompoundNode | null, value: string, raw: string, mapping: IndexMapping
    ) {
        super(superNbt, value, raw, mapping)
    }

    [ToFormattedString]() {
        return this.toString()
    }
}
