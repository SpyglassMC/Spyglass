import { LintConfig } from './Config'
import Formattable, { ToFormattedString } from './Formattable'
import { toJsonString } from '../utils/utils'
import NbtCompoundNode from './nodes/map/NbtCompoundNode'
import MapNode from './nodes/map/MapNode'

export type TextComponentType = NbtCompoundNode | string | TextComponentType[]

export default class TextComponent implements Formattable {
    constructor(
        public value: TextComponentType
    ) { }

    [ToFormattedString](lint: LintConfig): string {
        if (typeof this.value === 'string') {
            return this.value
        } else if (this.value instanceof NbtCompoundNode) {
            return toJsonString(this.value, lint)
        } else {
            return `[${
                this.value
                    .map(v => toJsonString(new TextComponent(v), lint))
                    .join(MapNode.getFormattedSep(',', lint.nbtCompoundCommaSpacing))
                }]`
        }
    }
}
