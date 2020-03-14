import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtLongNode extends NbtNumberNode<bigint> {
    readonly [NodeType] = 'NbtLong'
    readonly [NbtNodeType] = 'Long'
    protected readonly suffixConfigKey = 'nbtLongSuffix'
}
