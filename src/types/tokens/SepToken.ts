import { LintConfig } from '../Config'
import { ToFormattedString } from '../Formattable'
import { SepSpacingConfig, getStylisticConfig } from '../StylisticConfig'
import NewToken, { TokenSemanticInfo } from './NewToken'

type SepChar = string

type SepTokenOptions = {
    configKey: keyof LintConfig
}

type SepTokenActualData = {
    before: string,
    char: SepChar,
    after: string
}

export default class SepToken extends NewToken<SepTokenOptions, SepTokenActualData> {
    constructor(public options: SepTokenOptions) {
        super(options)
    }

    [ToFormattedString](lint: LintConfig, isTrailingSep = false): string {
        let before: string
        let after: string

        const { config } = getStylisticConfig<SepSpacingConfig>(lint, this.options.configKey)

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
