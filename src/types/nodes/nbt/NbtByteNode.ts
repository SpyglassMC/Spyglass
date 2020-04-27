import { LintConfig } from '../../Config'
import { GetFormattedString } from '../../Formattable'
import { ErrorCode } from '../../ParsingError'
import { NodeType } from '../ArgumentNode'
import NbtNode, { NbtNodeType, NbtNodeTypeName } from './NbtNode'
import NbtNumberNode from './NbtNumberNode'

class NbtByteNode extends NbtNumberNode {
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
module NbtByteNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToByte, 'byte', (s, v, r) => new NbtByteNode(s, Number(v), r)])
}

export default NbtByteNode

export function isNbtByteNode(node: NbtNode): node is NbtByteNode {
    return node[NbtNodeType] === 'Byte'
}
