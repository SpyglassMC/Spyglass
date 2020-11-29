import { ErrorCode } from '../types/ParsingError'
import { NodeType } from './ArgumentNode'
import { NbtNode, NbtNodeType } from './NbtNode'
import { NbtNumberNode } from './NbtNumberNode'

export class NbtLongNode extends NbtNumberNode<bigint> {
    readonly [NodeType] = 'NbtLong'
    readonly [NbtNodeType] = 'Long'
    protected readonly suffixConfigKey = 'nbtLongSuffix'
}

/* istanbul ignore next */
export module NbtLongNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToLong, 'long', (s, v, r) => new NbtLongNode(s, BigInt(v), r)])
}

export function isNbtLongNode(node: NbtNode): node is NbtLongNode {
    return node[NbtNodeType] === 'Long'
}
