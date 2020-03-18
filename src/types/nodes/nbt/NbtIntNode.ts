import NbtNode, { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'

export default class NbtIntNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtInt'
    readonly [NbtNodeType] = 'Int'
    protected readonly suffixConfigKey = undefined
}

export function isNbtIntNode(node: NbtNode): node is NbtIntNode {
    return node[NbtNodeType] === 'Int'
}
