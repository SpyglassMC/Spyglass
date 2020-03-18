import { ToFormattedString } from '../../Formattable'
import NbtPrimitiveNode from './NbtPrimitiveNode'
import { NodeType } from '../ArgumentNode'
import { NbtNodeType } from './NbtNode'
import NbtCompoundNode from '../map/NbtCompoundNode'
import IndexMapping from '../../IndexMapping'

export default class NbtStringNode extends NbtPrimitiveNode<string> {
    readonly [NodeType]: string = 'NbtString'
    readonly [NbtNodeType] = 'String'

    constructor(
        superNbt: NbtCompoundNode | null, value: string, raw: string,
        public mapping: IndexMapping 
    ) {
        super(superNbt, value, raw)
    }

    [ToFormattedString]() {
        return this.toString()
    }
}
