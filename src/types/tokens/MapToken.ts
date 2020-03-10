import { LintConfig } from '../Config'
import { NbtCompoundTag, getNbtCompoundTag } from '../NbtTag'
import Identity from '../Identity'
import Formattable, { ToFormattedString } from '../Formattable'
import SepToken from './SepToken'
import { getStylisticConfig } from '../StylisticConfig'
import NewToken, { TokenSemanticInfo } from './NewToken'
import BracketToken from './BracketToken'

export type ShouldInsertSpacesPredicate = (lint: LintConfig, data?: any) => boolean

type MapTokenOptions = {
    sortKeysConfig: keyof LintConfig,
    trailingCommaConfig: keyof LintConfig
}

type MapTokenActualData = {
    open: BracketToken,
    /**
     * [key, sep, value, pairSep]
     */
    content: [string, SepToken, string, SepToken?][],
    close: BracketToken
}

export default class MapToken extends NewToken<MapTokenOptions, MapTokenActualData> {
    constructor(public options: MapTokenOptions) {
        super(options)
    }

    [ToFormattedString](lint: LintConfig) {
        const actual = this.actual!
        let content = actual.content
        if (lint.stateSortKeys) {
            content = content.sort(([keyA], [keyB]) => keyA.toLowerCase() <= keyB.toLowerCase() ? -1 : 1)
        }

        let states: string
        if (content.length > 0) {

        } else {

        }
        states = content.length > 0 ?
            `${BlockToken.StatesBeginSymbol}${
            content.map(v => `${v}${this.getEqualSign(lint)}${this.content[v]}`).join(this.getComma(lint))
            }${BlockToken.StatesEndSymbol}` :
            ''

        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToFormattedString](lint) : ''

        return `${id}${states}${tag}`
    }
}
