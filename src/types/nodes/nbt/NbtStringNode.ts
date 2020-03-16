import { ToFormattedString } from '../../Formattable'
import NbtPrimitiveNode from './NbtPrimitiveNode'
import { NodeType } from '../ArgumentNode'
import { NbtNodeType } from './NbtNode'

export default class NbtStringNode extends NbtPrimitiveNode<string> {
    readonly [NodeType]: string = 'NbtString'
    readonly [NbtNodeType] = 'String';

    [ToFormattedString]() {
        return this.toString()
    }
}
