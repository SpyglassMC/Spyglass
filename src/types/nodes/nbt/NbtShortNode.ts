import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtShortNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtShort'
    readonly [NbtNodeType] = 'Short'
    protected readonly suffixConfigKey = 'nbtShortSuffix'
}
