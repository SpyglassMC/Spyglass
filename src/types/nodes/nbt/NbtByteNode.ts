import NbtNode, { NbtNodeType, NbtNodeTypeName } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export default class NbtByteNode extends NbtNumberNode {
    readonly [NodeType]: string = 'NbtByte'
    readonly [NbtNodeType]: NbtNodeTypeName = 'Byte'
    protected readonly suffixConfigKey = 'nbtByteSuffix';

    [ToFormattedString](lint: LintConfig): string {
        const lowerCasedString = this.toString().toLowerCase()
        if (lowerCasedString === 'false' || lowerCasedString === 'true') {
            return lowerCasedString
        }
        return super[ToFormattedString](lint)
    }
}

export function isNbtByteNode(node: NbtNode): node is NbtByteNode {
    return node[NbtNodeType] === 'Byte'
}
