import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtNumberNode from './NbtNumberNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export default class NbtDoubleNode extends NbtNumberNode {
    readonly [NodeType] = 'NbtDouble'
    readonly [NbtNodeType] = 'Double'
    protected readonly suffixConfigKey = 'nbtDoubleSuffix';

    [ToFormattedString](lint: LintConfig): string {
        if (lint.nbtDoubleOmitSuffix && this.toString().includes('.')) {
            return this.toString()
        }
        return super[ToFormattedString](lint)
    }
}
