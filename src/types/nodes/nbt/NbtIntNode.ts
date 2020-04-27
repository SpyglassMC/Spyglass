import { ErrorCode } from '../../ParsingError'
import { NodeType } from '../ArgumentNode'
import NbtNode, { NbtNodeType } from './NbtNode'
import NbtNumberNode from './NbtNumberNode'

class NbtIntNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtInt'
    readonly [NbtNodeType] = 'Int'
    protected readonly suffixConfigKey = undefined
}

export function isNbtIntNode(node: NbtNode): node is NbtIntNode {
    return node[NbtNodeType] === 'Int'
}

/* istanbul ignore next */
module NbtIntNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToInt, 'int', (s, v, r) => new NbtIntNode(s, Number(v), r)])
}

export default NbtIntNode
