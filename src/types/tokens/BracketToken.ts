import { LintConfig } from '../Config'
import { ToFormattedString } from '../Formattable'
import { getStylisticConfig, BracketSpacingConfig } from '../StylisticConfig'
import NewToken, { TokenSemanticInfo } from './NewToken'

export const enum BracketType {
    open,
    close
}
type BracketChar = string

type BracketTokenOptions = {
    type: BracketType,
    configKey: keyof LintConfig
}

type BracketTokenActualData = {
    char: BracketChar,
    inside: string
}

export default class BracketToken extends NewToken<BracketTokenOptions, BracketTokenActualData> {
    constructor(public options: BracketTokenOptions) {
        super(options)
    }

    [ToFormattedString](lint: LintConfig): string {
        const actual = this.actual!
        let insideSpacing: string

        const { config } = getStylisticConfig<BracketSpacingConfig>(lint, this.options.configKey)

        if (!config) {
            insideSpacing = actual.inside
        } else {
            insideSpacing = config.inside ? ' ' : ''
        }

        if (this.options.type === BracketType.open) {
            return `${actual.char}${insideSpacing}`
        } else {
            return `${insideSpacing}${actual.char}`
        }
    }
}
