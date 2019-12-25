import { LintConfig, constructConfig } from './Config'
import Lintable, { ToLintedString } from './Lintable'
import { NbtCompoundTag, isNbtCompoundTag, getComma } from './NbtTag'

export type TextComponentType = NbtCompoundTag | string | TextComponentType[]

/* istanbul ignore next */
export function getJsonConfig(lint: LintConfig) {
    return constructConfig({
        lint: {
            ...lint,
            quoteType: 'always double',
            quoteSnbtStringKeys: true,
            quoteSnbtStringValues: true,
            snbtUseBooleans: true,
            snbtOmitDoubleSuffix: true
        }
    })
}

export default class TextComponent implements Lintable {
    constructor(
        public value: TextComponentType
    ) { }

    [ToLintedString](lint: LintConfig): string {
        const { lint: jsonLint } = getJsonConfig(lint)
        if (typeof this.value === 'string') {
            return this.value
        } else if (isNbtCompoundTag(this.value)) {
            return this.value[ToLintedString](jsonLint)
        } else {
            return `[${
                this.value
                    .map(v => new TextComponent(v)[ToLintedString](jsonLint))
                    .join(getComma(jsonLint))
            }]`
        }
    }
}
