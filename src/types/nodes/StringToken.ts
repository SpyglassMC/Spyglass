import { LintConfig } from '../Config'
import { ToFormattedString } from '../Formattable'
import { SepSpacingConfig, getStylisticConfig } from '../StylisticConfig'
import NewToken, { TokenSemanticInfo } from './NewToken'

type QuoteChar = string

type StringTokenOptions = {
    configKey: keyof LintConfig
}

type StringTokenActualData = {
    quote: string,
    char: QuoteChar,
    after: string
}

export default class StringToken extends NewToken<StringTokenOptions, StringTokenActualData> {
    constructor(public options: StringTokenOptions) {
        super(options)
    }

    [ToFormattedString](lint: LintConfig, isTrailingSep = false): string {
        let before: string
        let after: string

        const config = getStylisticConfig<SepSpacingConfig>(lint, this.options.configKey)

        if (isTrailingSep || !config) {
            before = this.actual.before
            after = this.actual.after
        } else {
            before = config.before ? ' ' : ''
            after = config.after ? ' ' : ''
        }

        return `${before}${this.actual.char}${after}`
    }
}
