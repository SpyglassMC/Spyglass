import { LintConfig } from './Config'
import { NbtCompoundTag, getNbtCompoundTag } from './NbtTag'
import Identity from './Identity'
import Lintable, { ToLintedString } from './Lintable'
import BlockArgumentParser from '../parsers/BlockArgumentParser'

export default class Block implements Lintable {
    static readonly StatesBeginSymbol = '['
    static readonly StatesEndSymbol = ']'

    constructor(
        public id: Identity,
        public states: {
            [key: string]: string
        } = {},
        public nbt: NbtCompoundTag = getNbtCompoundTag({})
    ) { }

    private getComma(lint: LintConfig) {
        if (lint.blockStateAppendSpaceAfterComma) {
            return ', '
        } else {
            return ','
        }
    }
    private getEqualSign(lint: LintConfig) {
        if (lint.blockStatePutSpacesAroundEqualSign) {
            return ' = '
        } else {
            return '='
        }
    }

    [ToLintedString](lint: LintConfig) {
        const id = `${this.id[ToLintedString](lint)}`

        let stateKeys = Object.keys(this.states)
        if (lint.blockStateSortKeys) {
            stateKeys = stateKeys.sort()
        }
        const states = stateKeys.length > 0 ?
            `${Block.StatesBeginSymbol}${
                stateKeys.map(v => `${v}${this.getEqualSign(lint)}${this.states[v]}`).join(this.getComma(lint))
            }${Block.StatesEndSymbol}` :
            ''

        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToLintedString](lint) : ''
        
        return `${id}${states}${tag}`
    }
}
