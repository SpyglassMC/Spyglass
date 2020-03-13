import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtFloatNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtFloat'
    readonly [NbtNodeType] = 'Float'
    protected readonly suffixConfigKey = 'nbtFloatSuffix'
}
