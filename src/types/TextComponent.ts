import { LintConfig } from './Config'
import Lintable, { ToLintedString } from './Lintable'
import { NbtCompoundTag, isNbtCompoundTag, getComma } from './NbtTag'
import { toJsonString } from '../utils/utils'

export type TextComponentType = NbtCompoundTag | string | TextComponentType[]

export default class TextComponent implements Lintable {
    constructor(
        public value: TextComponentType
    ) { }

    [ToLintedString](lint: LintConfig): string {
        if (typeof this.value === 'string') {
            return this.value
        } else if (isNbtCompoundTag(this.value)) {
            return toJsonString(this.value, lint)
        } else {
            return `[${
                this.value
                    .map(v => toJsonString(new TextComponent(v), lint))
                    .join(getComma(lint))
            }]`
        }
    }
}
