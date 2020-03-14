import { NbtNodeType } from './NbtNode'
import { NodeType } from '../ArgumentNode'
import NbtByteNode from './NbtByteNode'
import { ToFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'

export default class NbtBooleanNode extends NbtByteNode {
    readonly [NodeType] = 'NbtBoolean'
    readonly [NbtNodeType] = 'Boolean';

    [ToFormattedString](lint: LintConfig) {
        if (lint.nbtBoolean) {
            if (this.valueOf() === 0) {
                return 'false'
            } else {
                return 'true'
            }
        }
        return super[ToFormattedString](lint)
    }
}
