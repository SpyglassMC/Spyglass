import NbtNode from './NbtNode'
import NbtCollectionNode from './NbtCollectionNode'
import { LintConfig } from '../../Config'

export default abstract class NbtArrayNode<T extends NbtNode> extends NbtCollectionNode<T> {
    protected abstract chars: {
        closeBracket: string,
        openBracket: string,
        sep: string,
        type: string
    }

    protected readonly configKeys: { bracketSpacing: keyof LintConfig, semicolonSpacing: keyof LintConfig, sepSpacing: keyof LintConfig, trailingPairSep: keyof LintConfig } = {
        bracketSpacing: 'nbtArrayBracketSpacing',
        semicolonSpacing: 'nbtArraySemicolonSpacing',
        sepSpacing: 'nbtArrayCommaSpacing',
        trailingPairSep: 'nbtArrayTrailingComma'
    }

    protected getFormattedOpenBracket(lint: LintConfig) {
        const { after } = lint[this.configKeys.semicolonSpacing] as { after: number }
        return `${this.chars.openBracket}${this.chars.type}${this.length > 0 ? `;${' '.repeat(after)}` : ';'}`
    }
}
