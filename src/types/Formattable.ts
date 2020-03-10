import { LintConfig } from './Config'

export const ToFormattedString = Symbol()

export default interface Formattable {
    [ToFormattedString](lint: LintConfig): string
}
