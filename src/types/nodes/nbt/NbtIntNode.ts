import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtIntNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtInt'
    readonly [NbtNodeType] = 'Int'
    protected readonly suffixConfigKey = undefined
}
