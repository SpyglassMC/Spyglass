import { ErrorCode } from '../../ParsingError'
import { NodeType } from '../ArgumentNode'
import NbtNode, { NbtNodeType } from './NbtNode'
import NbtNumberNode from './NbtNumberNode'

class NbtLongNode extends NbtNumberNode<bigint> {
    readonly [NodeType] = 'NbtLong'
    readonly [NbtNodeType] = 'Long'
    protected readonly suffixConfigKey = 'nbtLongSuffix'
}

export function isNbtLongNode(node: NbtNode): node is NbtLongNode {
    return node[NbtNodeType] === 'Long'
}

/* istanbul ignore next */
module NbtLongNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToLong, 'long', (s, v, r) => new NbtLongNode(s, BigInt(v), r)])
}

export default NbtLongNode
