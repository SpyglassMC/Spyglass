import { NbtNodeType, NbtNodeTypeName } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtByteNode extends NbtNumberNode {
    readonly [NodeType]: string = 'NbtByte'
    readonly [NbtNodeType]: NbtNodeTypeName = 'Byte'
    protected readonly suffixConfigKey = 'nbtByteSuffix'
}
