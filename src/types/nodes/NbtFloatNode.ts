import { ErrorCode } from '../ParsingError'
import { NodeType } from './ArgumentNode'
import { NbtNodeType } from './NbtNode'
import { NbtNumberNode } from './NbtNumberNode'

export class NbtFloatNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtFloat'
    readonly [NbtNodeType] = 'Float'
    protected readonly suffixConfigKey = 'nbtFloatSuffix'
}

/* istanbul ignore next */
export module NbtFloatNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToFloat, 'float', (s, v, r) => new NbtFloatNode(s, Number(v), r)])
}
