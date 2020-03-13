import { DiagnosticSeverity } from 'vscode-languageserver'

export type SeverityConfig = 'none' | 'hint' | 'information' | 'warning' | 'error'

export type SepSpacingConfig = { before: number, after: number }
export type BracketSpacingConfig = { inside: number, zeroValue?: number, oneValue?: number }
export type NbtListBracketSpacingConfig = { list?: number, compound?: number } & BracketSpacingConfig

export function getDiagnosticSeverity(s: SeverityConfig | undefined) {
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
