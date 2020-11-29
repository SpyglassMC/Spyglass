import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ErrorCode } from '../types/ParsingError'
import { NodeType } from './ArgumentNode'
import { NbtNode, NbtNodeType, NbtNodeTypeName } from './NbtNode'
import { NbtNumberNode } from './NbtNumberNode'

export class NbtByteNode extends NbtNumberNode {
    readonly [NodeType]: string = 'NbtByte'
    readonly [NbtNodeType]: NbtNodeTypeName = 'Byte'
    protected readonly suffixConfigKey = 'nbtByteSuffix';

    [GetFormattedString](lint: LintConfig): string {
        const lowerCasedString = this.toString().toLowerCase()
        if (lowerCasedString === 'false' || lowerCasedString === 'true') {
            return lowerCasedString
        }
        return super[GetFormattedString](lint)
    }
}

/* istanbul ignore next */
export module NbtByteNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToByte, 'byte', (s, v, r) => new NbtByteNode(s, Number(v), r)])
}

export function isNbtByteNode(node: NbtNode): node is NbtByteNode {
    return node[NbtNodeType] === 'Byte'
}
