import { DiagnosticSeverity } from 'vscode-languageserver'

export type SeverityConfig = 'hint' | 'information' | 'warning' | 'error'

export interface SepSpacingConfig {
    before: number,
    after: number
}
export interface BracketSpacingConfig {
    inside: number,
    zeroValue?: number,
    oneValue?: number
}
export interface NbtListBracketSpacingConfig extends BracketSpacingConfig {
    list?: number,
    compound?: number
}

export type DiagnosticConfig<T> = null | [SeverityConfig, T]

export function getDiagnosticSeverity(s: SeverityConfig | undefined, fallback: DiagnosticSeverity = DiagnosticSeverity.Hint) {
    switch (s) {
        case 'error':
            return DiagnosticSeverity.Error
        case 'warning':
            return DiagnosticSeverity.Warning
        case 'information':
            return DiagnosticSeverity.Information
        case 'hint':
            return DiagnosticSeverity.Hint
        default:
            return fallback
    }
}
