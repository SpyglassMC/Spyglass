import NbtNode from './NbtNode'
import { GetFormattedString } from '../../Formattable'
import { LintConfig } from '../../Config'
import MapNode, { BracketType } from '../map/MapNode'
import { BracketSpacingConfig, SepSpacingConfig } from '../../StylisticConfig'
import { toFormattedString } from '../../../utils/utils'

export default abstract class NbtCollectionNode<T extends NbtNode> extends NbtNode implements ArrayLike<T>, Iterable<T> {
    [index: number]: T

    protected abstract configKeys: {
        bracketSpacing: keyof LintConfig,
        sepSpacing: keyof LintConfig,
        trailingPairSep: keyof LintConfig
    }

    protected abstract chars: {
        closeBracket: string,
        openBracket: string,
        sep: string
    }

    length = 0

    push(...values: T[]) {
        for (const value of values) {
            this[this.length++] = value
        }
    }

    *[Symbol.iterator](): Iterator<T, any, undefined> {
        // You want me to call myself for iterating? Stupid!
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.length; i++) {
            yield this[i]
        }
    }

    protected getFormattedOpenBracket(lint: LintConfig) {
        const bracketSpacingConfig = lint[this.configKeys.bracketSpacing] as BracketSpacingConfig
        return MapNode.getFormattedBracket(this.chars.openBracket, BracketType.open, bracketSpacingConfig)
    }

    [GetFormattedString](lint: LintConfig) {
        const bracketSpacingConfig = lint[this.configKeys.bracketSpacing] as BracketSpacingConfig
        const sepSpacingConfig = lint[this.configKeys.sepSpacing] as SepSpacingConfig
        const trailingPairSepConfig = lint[this.configKeys.trailingPairSep] as boolean

        const open = this.getFormattedOpenBracket(lint)
        const close = MapNode.getFormattedBracket(this.chars.closeBracket, BracketType.close, bracketSpacingConfig)
        const sep = MapNode.getFormattedSep(this.chars.sep, sepSpacingConfig)

        const content: string[] = []
        for (const value of this) {
            content.push(toFormattedString(value, lint))
        }

        let contentString = content.join(sep)
        if (trailingPairSepConfig) {
            contentString += MapNode.getFormattedSep(this.chars.sep, sepSpacingConfig, true)
        }

        return `${open}${contentString}${close}`
    }
}
