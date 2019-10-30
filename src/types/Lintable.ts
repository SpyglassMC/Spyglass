import { LintConfig } from './Config'

export const ToLintedString = Symbol()

export default interface Lintable {
    [ToLintedString](lint: LintConfig): string
}
