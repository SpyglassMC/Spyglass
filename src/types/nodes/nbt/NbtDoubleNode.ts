import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'
import { GetFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export default class NbtDoubleNode extends NbtNumberNode {
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
