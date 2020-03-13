import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtByteNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtByte'
    readonly [NbtNodeType] = 'Byte'
    protected readonly suffixConfigKey = 'nbtByteSuffix'
}
