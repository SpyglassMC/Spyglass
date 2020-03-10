import { LintConfig } from '../Config'
import { NbtCompoundTag, getNbtCompoundTag } from '../NbtTag'
import Identity from '../Identity'
import Formattable, { ToFormattedString } from '../Formattable'
import SepToken from './SepToken'
import { getStylisticConfig } from '../StylisticConfig'
import NewToken, { TokenSemanticInfo } from './NewToken'

type BlockTokenActualData = {
    id: Identity,
    
}

export default class BlockToken extends NewToken<> {
    static readonly StatesBeginSymbol = '['
    static readonly StatesEndSymbol = ']'

    constructor(
        public semantic: TokenSemanticInfo,
        public id: Identity,
        /**
         * [key, equal sign, value, comma]
         */
        public states: [string, SepToken, string, SepToken][] = [],
        public nbt: NbtCompoundTag = getNbtCompoundTag({})
    ) {
        super(semantic)
    }

    [ToFormattedString](lint: LintConfig) {
        const id = `${this.id[ToFormattedString](lint)}`

        let stateKeys = this.states
        if (lint.stateSortKeys) {
            stateKeys = stateKeys.sort(([keyA], [keyB]) => keyA <= keyB ? -1 : 1)
        }

        let states: string
        if (stateKeys.length > 0) {

        } else {

        }
        states = stateKeys.length > 0 ?
            `${BlockToken.StatesBeginSymbol}${
            stateKeys.map(v => `${v}${this.getEqualSign(lint)}${this.states[v]}`).join(this.getComma(lint))
            }${BlockToken.StatesEndSymbol}` :
            ''

        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToFormattedString](lint) : ''

        return `${id}${states}${tag}`
    }
}
