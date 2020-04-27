import { LintConfig } from '../../Config'
import { GetFormattedString } from '../../Formattable'
import { ErrorCode } from '../../ParsingError'
import { NodeType } from '../ArgumentNode'
import { NbtNodeType } from './NbtNode'
import NbtNumberNode from './NbtNumberNode'

class NbtDoubleNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtDouble'
    readonly [NbtNodeType] = 'Double'
    protected readonly suffixConfigKey = 'nbtDoubleSuffix';

    [GetFormattedString](lint: LintConfig): string {
        if (lint.nbtDoubleOmitSuffix && this.toString().includes('.')) {
            return this.toString()
        }
        return super[GetFormattedString](lint)
    }
}

/* istanbul ignore next */
module NbtDoubleNode {
    NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToDouble, 'double', (s, v, r) => new NbtDoubleNode(s, Number(v), r)])
}

export default NbtDoubleNode
