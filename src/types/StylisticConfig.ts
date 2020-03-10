import { DiagnosticSeverity } from 'vscode-languageserver'
import { LintConfig } from './Config'

type SeverityConfig = 'none' | 'hint' | 'information' | 'warning' | 'error'

type StylisticConfig<T> = null | T | [
    /**
     * The settings for this style check.
     */
    T,
    /**
     * The diagnostic severity of this style check,
     */
    SeverityConfig?
]

export default StylisticConfig

export type SepSpacingConfig = { before: boolean, after: boolean }
export type BracketSpacingConfig = { inside: boolean /* , zeroValue?: boolean, oneValue?: boolean */ }

export function getStylisticConfig<T>(lint: LintConfig, key: keyof LintConfig): { config: T | null, severity: null | DiagnosticSeverity } {
    const config = lint[key] as StylisticConfig<T>
    if (config === null) {
        return { config: null, severity: null }
    } else if (config instanceof Array) {
        return { config: config[0], severity: getDiagnosticSeverity(config[1]) }
    } else {
        return { config, severity: null }
    }
}

function getDiagnosticSeverity(s: SeverityConfig | undefined) {
    switch (s) {
        case 'error':
            return DiagnosticSeverity.Error
        case 'warning':
            return DiagnosticSeverity.Warning
        case 'information':
            return DiagnosticSeverity.Information
        case 'hint':
            return DiagnosticSeverity.Hint
        case 'none':
        default:
            return null
    }
}
